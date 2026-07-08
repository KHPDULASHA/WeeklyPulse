import { z } from 'zod';

export const createReportSchema = z.object({
  project_id: z.number().int().positive(),
  week_start: z.string().min(1, 'week_start is required'),
  week_end: z.string().min(1, 'week_end is required'),
  tasks_completed: z.string().min(5, 'tasks_completed must be at least 5 characters'),
  tasks_planned: z.string().min(5, 'tasks_planned must be at least 5 characters'),
  planned_tasks: z.string().optional(),
  blockers: z.string().optional(),
  hours_worked: z.number().min(1, 'hours_worked must be at least 1'),
  notes: z.string().optional(),
  status: z.enum(['draft', 'submitted']).optional()
});

export const updateReportSchema = createReportSchema.partial();
