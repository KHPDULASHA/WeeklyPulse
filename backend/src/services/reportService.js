import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ReportService {
  async createReport(userId, data) {
    return prisma.weeklyReport.create({
      data: {
        user_id: userId,
        project_id: data.project_id,
        week_start: new Date(data.week_start),
        week_end: new Date(data.week_end),
        tasks_completed: data.tasks_completed,
        tasks_planned: data.planned_tasks || data.tasks_planned,
        blockers: data.blockers || null,
        hours_worked: Number(data.hours_worked),
        notes: data.notes || null,
        status: data.status || 'draft'
      },
      include: {
        user: true,
        project: true
      }
    });
  }

  async getReportsForUser(userId) {
    return prisma.weeklyReport.findMany({
      where: { user_id: userId },
      orderBy: { submitted_at: 'desc' },
      include: {
        project: true
      }
    });
  }

  async getReportById(id, user) {
    const report = await prisma.weeklyReport.findUnique({
      where: { id },
      include: {
        user: true,
        project: true
      }
    });

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role !== 'manager' && report.user_id !== user.id) {
      const error = new Error('You can only view your own reports');
      error.statusCode = 403;
      throw error;
    }

    return report;
  }

  async updateReport(id, user, data) {
    const report = await prisma.weeklyReport.findUnique({ where: { id } });
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role !== 'manager' && report.user_id !== user.id) {
      const error = new Error('You can only edit your own reports');
      error.statusCode = 403;
      throw error;
    }

    if (report.status === 'submitted') {
      const error = new Error('Submitted reports cannot be edited');
      error.statusCode = 400;
      throw error;
    }

    return prisma.weeklyReport.update({
      where: { id },
      data: {
        project_id: data.project_id,
        week_start: data.week_start ? new Date(data.week_start) : undefined,
        week_end: data.week_end ? new Date(data.week_end) : undefined,
        tasks_completed: data.tasks_completed,
        tasks_planned: data.tasks_planned,
        blockers: data.blockers,
        hours_worked: data.hours_worked ? Number(data.hours_worked) : undefined,
        notes: data.notes,
        status: data.status
      },
      include: {
        user: true,
        project: true
      }
    });
  }

  async submitReport(id, user) {
    const report = await prisma.weeklyReport.findUnique({ where: { id } });
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.role !== 'manager' && report.user_id !== user.id) {
      const error = new Error('You can only submit your own reports');
      error.statusCode = 403;
      throw error;
    }

    return prisma.weeklyReport.update({
      where: { id },
      data: { status: 'submitted', submitted_at: new Date() },
      include: {
        user: true,
        project: true
      }
    });
  }

  async getAllReports(query = {}) {
    const where = {};

    if (query.employee) {
      where.user = { full_name: { contains: query.employee, mode: 'insensitive' } };
    }

    if (query.project) {
      where.project = { project_name: { contains: query.project, mode: 'insensitive' } };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.week_start = {};
      if (query.startDate) where.week_start.gte = new Date(query.startDate);
      if (query.endDate) where.week_start.lte = new Date(query.endDate);
    }

    return prisma.weeklyReport.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
      include: {
        user: true,
        project: true
      }
    });
  }
}

export const reportService = new ReportService();
