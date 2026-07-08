import { z } from 'zod';

export const createProjectSchema = z.object({
  project_name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'completed']).optional()
});

export const updateProjectSchema = createProjectSchema.partial();
