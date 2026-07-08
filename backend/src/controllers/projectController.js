import { projectService } from '../services/projectService.js';

export const projectController = {
  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json({ project });
    } catch (error) {
      next(error);
    }
  },

  async getAllProjects(_req, res, next) {
    try {
      const projects = await projectService.getAllProjects();
      res.json({ projects });
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req, res, next) {
    try {
      const project = await projectService.getProjectById(Number(req.params.id));
      res.json({ project });
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(Number(req.params.id), req.body);
      res.json({ project });
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
