import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  async getManagerDashboard(req, res, next) {
    try {
      const analytics = await dashboardService.getManagerDashboard();
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
};
