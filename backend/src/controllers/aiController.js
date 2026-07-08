import { aiService } from '../services/aiService.js';

export const aiController = {
  async ask(req, res, next) {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ error: 'A question is required' });
      }

      const answer = await aiService.answerQuestion(question, req.user);
      res.json({ answer });
    } catch (error) {
      next(error);
    }
  }
};
