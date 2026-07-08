import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authorizeRole, ROLE_NAMES } from './middleware/authorizeRole.js';
import { env } from './utils/env.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const roles = [
  { id: 1, role_name: 'team_member' },
  { id: 2, role_name: 'manager' }
];

function createToken(user) {
  const roleName = getRoleName(user.role_id);
  return jwt.sign({ id: user.id, email: user.email, role_id: user.role_id, role: roleName }, env.jwtSecret, { expiresIn: '8h' });
}

function getRoleName(roleId) {
  return roles.find((role) => role.id === roleId)?.role_name || 'team_member';
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const registerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role_name: z.string().optional()
});

const reportSchema = z.object({
  project_id: z.number().int().positive(),
  week_start: z.string(),
  week_end: z.string(),
  tasks_completed: z.string().min(5),
  tasks_planned: z.string().min(5),
  blockers: z.string().optional(),
  hours_worked: z.number().min(1),
  notes: z.string().optional(),
  status: z.string().optional()
});

const reportUpdateSchema = reportSchema.partial();

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'weeklypulse-api' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const roleName = parsed.role_name === 'manager' ? 'manager' : 'team_member';
    let role = await prisma.role.findUnique({ where: { role_name: roleName } });
    if (!role) {
      role = await prisma.role.create({ data: { role_name: roleName } });
    }

    const user = await prisma.user.create({
      data: {
        full_name: parsed.full_name,
        email: parsed.email,
        password_hash: bcrypt.hashSync(parsed.password, 10),
        role_id: role.id
      }
    });

    const token = createToken(user, role.role_name);
    res.status(201).json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: role.role_name } });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user, user.role.role_name);
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role.role_name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { role: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role.role_name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { id: 'asc' } });
    res.json({ projects });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/projects', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), async (req, res) => {
  try {
    const { project_name, description, status } = req.body;
    if (!project_name) return res.status(400).json({ error: 'Project name is required' });

    const project = await prisma.project.create({
      data: {
        project_name,
        description: description || null,
        status: status || 'active'
      }
    });

    res.status(201).json({ project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports', authenticateToken, async (req, res) => {
  try {
    const reports = await prisma.weeklyReport.findMany({
      where: req.user.role === ROLE_NAMES.MANAGER ? {} : { user_id: req.user.id },
      orderBy: { submitted_at: 'desc' },
      include: { project: true, user: true }
    });

    res.json({ reports });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/reports', authenticateToken, authorizeRole(ROLE_NAMES.TEAM_MEMBER), async (req, res) => {
  try {
    const parsed = reportSchema.parse(req.body);
    const project = await prisma.project.findUnique({ where: { id: parsed.project_id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const report = await prisma.weeklyReport.create({
      data: {
        user_id: req.user.id,
        project_id: parsed.project_id,
        week_start: new Date(parsed.week_start),
        week_end: new Date(parsed.week_end),
        tasks_completed: parsed.tasks_completed,
        tasks_planned: parsed.tasks_planned,
        blockers: parsed.blockers || null,
        hours_worked: parsed.hours_worked,
        notes: parsed.notes || null,
        status: parsed.status || 'draft'
      },
      include: { user: true, project: true }
    });

    res.status(201).json({ report });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

app.put('/api/reports/:id', authenticateToken, authorizeRole(ROLE_NAMES.TEAM_MEMBER, ROLE_NAMES.MANAGER), async (req, res) => {
  try {
    const reportId = Number(req.params.id);
    const existingReport = await prisma.weeklyReport.findUnique({ where: { id: reportId } });

    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (req.user.role === ROLE_NAMES.TEAM_MEMBER && existingReport.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own reports' });
    }

    const parsed = reportUpdateSchema.parse(req.body);
    const updatedReport = await prisma.weeklyReport.update({
      where: { id: reportId },
      data: {
        project_id: parsed.project_id,
        week_start: parsed.week_start ? new Date(parsed.week_start) : undefined,
        week_end: parsed.week_end ? new Date(parsed.week_end) : undefined,
        tasks_completed: parsed.tasks_completed,
        tasks_planned: parsed.tasks_planned,
        blockers: parsed.blockers,
        hours_worked: parsed.hours_worked,
        notes: parsed.notes,
        status: parsed.status
      },
      include: { user: true, project: true }
    });

    res.json({ report: updatedReport });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

app.get('/api/dashboard', authenticateToken, authorizeRole(ROLE_NAMES.MANAGER), async (_req, res) => {
  try {
    const reports = await prisma.weeklyReport.findMany({
      include: { user: true, project: true },
      orderBy: { submitted_at: 'desc' }
    });
    const totalHours = reports.reduce((sum, report) => sum + Number(report.hours_worked), 0);
    const averageHours = reports.length ? Math.round(totalHours / reports.length) : 0;
    const activeProjects = await prisma.project.count({ where: { status: 'active' } });

    res.json({
      summary: {
        total_reports: reports.length,
        total_hours: totalHours,
        average_hours: averageHours,
        active_projects: activeProjects
      },
      reports
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use(errorHandler);

export default app;
