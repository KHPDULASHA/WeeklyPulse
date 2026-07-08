import { getHealthStatus } from '../services/healthService.js';

export function getHealth(req, res, next) {
  try {
    res.json(getHealthStatus());
  } catch (error) {
    next(error);
  }
}
