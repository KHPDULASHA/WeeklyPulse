import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();

class AiService {
  async answerQuestion(question, user) {
    if (user.role !== 'manager') {
      const error = new Error('Only managers can use the AI assistant');
      error.statusCode = 403;
      throw error;
    }

    const reports = await prisma.weeklyReport.findMany({
      where: {
        status: 'submitted'
      },
      orderBy: {
        submitted_at: 'desc'
      },
      include: {
        user: true,
        project: true
      }
    });

    const context = reports.map((report) => ({
      employee: report.user?.full_name || 'Unknown',
      project: report.project?.project_name || 'Unknown',
      week: report.week_start
        ? report.week_start.toISOString().slice(0, 10)
        : 'Unknown',
      completed: report.tasks_completed || '',
      planned: report.tasks_planned || '',
      blockers: report.blockers || 'None',
      hours: report.hours_worked || 0,
      status: report.status
    }));

    const prompt = this.buildPrompt(question, context);

    return this.callOpenAi(prompt, context);
  }

  buildPrompt(question, context) {
    return `
You are WeeklyPulse AI.

You help managers understand weekly team reports.

Answer ONLY using the report context below.
If information is unavailable, clearly say so.

Manager Question:
${question}

Weekly Reports:
${JSON.stringify(context, null, 2)}

Provide:
- A concise answer
- Bullet points where helpful
- Mention blockers if any
- Mention overall workload if relevant
`;
  }

  async callOpenAi(prompt, context) {
    const apiKey = process.env.OPENAI_API_KEY;

    // Offline fallback if API key is missing
    if (!apiKey || apiKey.trim() === '') {
      return this.generateFallbackResponse(context);
    }

    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You summarize weekly reports for managers. Keep responses concise and professional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.openai.com',
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
            'Content-Length': Buffer.byteLength(body)
          }
        },
        (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                console.error(parsed.error);

                // If OpenAI fails, use fallback instead of throwing an error
                resolve(this.generateFallbackResponse(context));
                return;
              }

              resolve(
                parsed.choices?.[0]?.message?.content ||
                  this.generateFallbackResponse(context)
              );
            } catch (err) {
              console.error(err);
              resolve(this.generateFallbackResponse(context));
            }
          });
        }
      );

      req.on('error', (err) => {
        console.error(err);
        resolve(this.generateFallbackResponse(context));
      });

      req.write(body);
      req.end();
    });
  }

  generateFallbackResponse(context) {
    if (!context || context.length === 0) {
      return `No submitted weekly reports were found.`;
    }

    const totalReports = context.length;

    const totalHours = context.reduce(
      (sum, report) => sum + (report.hours || 0),
      0
    );

    const employees = [...new Set(context.map((r) => r.employee))];

    const blockers = context.filter(
      (r) =>
        r.blockers &&
        r.blockers.trim() !== '' &&
        r.blockers.toLowerCase() !== 'none'
    );

    let response = `Weekly Summary (Offline Mode)

Submitted Reports: ${totalReports}
Employees: ${employees.length}
Total Hours Worked: ${totalHours}

Employees:
${employees.map((e) => `• ${e}`).join('\n')}

`;

    if (blockers.length > 0) {
      response += `Current Blockers:\n`;

      blockers.forEach((b) => {
        response += `• ${b.employee}: ${b.blockers}\n`;
      });
    } else {
      response += `Current Blockers:\n• No blockers reported.\n`;
    }

    response += `
OpenAI is currently unavailable or no API key is configured.

To receive AI-generated summaries and insights, configure:

OPENAI_API_KEY=your_api_key

and restart the backend server.
`;

    return response;
  }
}

export const aiService = new AiService();