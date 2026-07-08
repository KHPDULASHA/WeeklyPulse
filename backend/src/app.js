import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './utils/env.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

const roles = [
  { id: 1, role_name: 'team_member' },
  { id: 2, role_name: 'manager' }
];

const state = {
  users: [
    {
      id: 1,
      full_name: 'Ava Chen',
      email: 'ava@weeklypulse.dev',
      password_hash: bcrypt.hashSync('password123', 10),
      role_id: 2
    },
    {
      id: 2,
      full_name: 'Noah Patel',
      email: 'noah@weeklypulse.dev',
      password_hash: bcrypt.hashSync('password123', 10),
      role_id: 1
    }
  ],
  projects: [
    { id: 1, project_name: 'Platform Refresh', description: 'Modernize the delivery experience', status: 'active' },
    { id: 2, project_name: 'Client Insights', description: 'Launch the new analytics workspace', status: 'active' }
  ],
  reports: [
    {
      id: 1,
      user_id: 2,
      project_id: 1,
      week_start: '2026-07-06',
      week_end: '2026-07-12',
      tasks_completed: 'Completed onboarding checklist and API integration',
      tasks_planned: 'Prepare release notes and QA review',
      blockers: 'None',
      hours_worked: 38,
      notes: 'Steady progress with the new dashboard imports.',
      status: 'submitted',
      submitted_at: '2026-07-13T10:00:00.000Z'
    }
  ]
};

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, env.jwtSecret, { expiresIn: '8h' });
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

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'weeklypulse-api' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const exists = state.users.some((user) => user.email === parsed.email);
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const roleId = parsed.role_name === 'manager' ? 2 : 1;
    const user = {
      id: state.users.length + 1,
      full_name: parsed.full_name,
      email: parsed.email,
      password_hash: bcrypt.hashSync(parsed.password, 10),
      role_id: roleId
    };

    state.users.push(user);
    const token = createToken(user);
    res.status(201).json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: getRoleName(user.role_id) } });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = state.users.find((entry) => entry.email === email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createToken(user);
  res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: getRoleName(user.role_id) } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = state.users.find((entry) => entry.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ user: { id: user.id, full_name: user.full_name, email: user.email, role: getRoleName(user.role_id) } });
});

app.get('/api/projects', authenticateToken, (_req, res) => {
  res.json({ projects: state.projects });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { project_name, description, status } = req.body;
  if (!project_name) return res.status(400).json({ error: 'Project name is required' });

  const project = {
    id: state.projects.length + 1,
    project_name,
    description: description || '',
    status: status || 'active'
  };
  state.projects.push(project);
  res.status(201).json({ project });
});

app.get('/api/reports', authenticateToken, (req, res) => {
  const user = state.users.find((entry) => entry.id === req.user.id);
  const visibleReports = user?.role_id === 2
    ? state.reports
    : state.reports.filter((report) => report.user_id === req.user.id);

  res.json({ reports: visibleReports });
});

app.post('/api/reports', authenticateToken, (req, res) => {
  try {
    const parsed = reportSchema.parse(req.body);
    const report = {
      id: state.reports.length + 1,
      user_id: req.user.id,
      ...parsed,
      submitted_at: new Date().toISOString()
    };

    state.reports.push(report);
    res.status(201).json({ report });
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

app.get('/api/dashboard', authenticateToken, (req, res) => {
  const user = state.users.find((entry) => entry.id === req.user.id);
  const reports = user?.role_id === 2 ? state.reports : state.reports.filter((report) => report.user_id === req.user.id);
  const totalHours = reports.reduce((sum, report) => sum + report.hours_worked, 0);
  const averageHours = reports.length ? Math.round(totalHours / reports.length) : 0;

  res.json({
    summary: {
      total_reports: reports.length,
      total_hours: totalHours,
      average_hours: averageHours,
      active_projects: state.projects.filter((project) => project.status === 'active').length
    },
    reports
  });
});

app.use(errorHandler);

export default app;
