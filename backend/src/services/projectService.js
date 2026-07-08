import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ProjectService {
  async createProject(data) {
    return prisma.project.create({
      data: {
        project_name: data.project_name,
        description: data.description || null,
        status: data.status || 'active'
      }
    });
  }

  async getAllProjects() {
    return prisma.project.findMany({
      orderBy: { id: 'asc' }
    });
  }

  async getProjectById(id) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  async updateProject(id, data) {
    await this.getProjectById(id);

    return prisma.project.update({
      where: { id },
      data: {
        project_name: data.project_name,
        description: data.description,
        status: data.status
      }
    });
  }

  async deleteProject(id) {
    await this.getProjectById(id);

    await prisma.project.delete({ where: { id } });
  }
}

export const projectService = new ProjectService();
