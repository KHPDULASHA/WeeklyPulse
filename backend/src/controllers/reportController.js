import { reportService } from '../services/reportService.js';

export const reportController = {
  async createReport(req, res, next) {
    try {
      const report = await reportService.createReport(req.user.id, req.body);
      res.status(201).json({ report });
    } catch (error) {
      next(error);
    }
  },

  async getMyReports(req, res, next) {
    try {
      const reports = await reportService.getReportsForUser(req.user.id);
      res.json({ reports });
    } catch (error) {
      next(error);
    }
  },

  async getReportById(req, res, next) {
    try {
      const report = await reportService.getReportById(Number(req.params.id), req.user);
      res.json({ report });
    } catch (error) {
      next(error);
    }
  },

  async updateReport(req, res, next) {
    try {
      const report = await reportService.updateReport(Number(req.params.id), req.user, req.body);
      res.json({ report });
    } catch (error) {
      next(error);
    }
  },

  async submitReport(req, res, next) {
    try {
      const report = await reportService.submitReport(Number(req.params.id), req.user);
      res.json({ report });
    } catch (error) {
      next(error);
    }
  },

  async getAllReports(req, res, next) {
    try {
      const reports = await reportService.getAllReports(req.query);
      res.json({ reports });
    } catch (error) {
      next(error);
    }
  }
};
