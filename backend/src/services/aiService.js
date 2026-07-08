import { PrismaClient } from '@prisma/client';
import https from 'https';
import { env } from '../utils/env.js';

const prisma = new PrismaClient();

class AiService {
  async answerQuestion(question, user) {
    if (user.role !== 'manager') {
      const error = new Error('Only managers can use the AI assistant');
      error.statusCode = 403;
      throw error;
    }

    const reports = await prisma.weeklyReport.findMany({
      where: { status: 'submitted' },
      orderBy: { submitted_at: 'desc' },
      include: { user: true, project: true }
    });

    const context = reports.map((report) => ({
      employee: report.user?.full_name || 'Unknown',
      project: report.project?.project_name || 'Unknown',
      week: report.week_start ? report.week_start.toISOString().slice(0, 10) : 'Unknown',
      completed: report.tasks_completed,
      planned: report.tasks_planned,
      blockers: report.blockers || 'None',
      hours: report.hours_worked,
      status: report.status
    }));

    const prompt = this.buildPrompt(question, context);
    return this.callOpenAi(prompt);
  }

  buildPrompt(question, context) {
    return `You are WeeklyPulse AI. Help a manager understand weekly team reports.
Use only the provided report context. If the data is missing, say so clearly.

Question: ${question}

Report context:
${JSON.stringify(context, null, 2)}

Respond as a concise manager-friendly summary with bullet points when helpful.`;
  }

  async callOpenAi(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return 'AI assistance is unavailable because no OpenAI API key is configured. Please set OPENAI_API_KEY to enable this feature.';
    }

    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You summarize weekly team reports for managers.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4
    });

    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(body)
        }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              reject(new Error(parsed.error.message || 'OpenAI request failed'));
              return;
            }
            const answer = parsed.choices?.[0]?.message?.content || 'No answer generated.';
            resolve(answer);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

export const aiService = new AiService();
