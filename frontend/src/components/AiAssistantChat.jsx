import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const starterQuestions = [
  'Summarize this week',
  'Who has blockers?',
  'Highest workload?',
  'Generate weekly summary'
];

export function AiAssistantChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'I can summarize weekly reports for you. Ask about team progress, blockers, workload, or request a weekly summary.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendQuestion = async (question) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('weeklypulse_token');
      const response = await api.post(
        '/ai/ask',
        { question: trimmed },
        { headers: token ? { Authorization: 'Bearer ' + token } : undefined }
      );
      setMessages((current) => [...current, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            error.response?.data?.error ||
            error.message ||
            'The assistant could not answer that request.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Quick Questions</div>
      <div className="flex flex-col gap-2">
        {starterQuestions.map((question) => (
          <button
            key={question}
            onClick={() => sendQuestion(question)}
            disabled={loading}
            className="w-full text-left rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-700 hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            → {question}
          </button>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-3">
        <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">Messages</div>
        <div className="flex-1 space-y-3 rounded-xl border border-slate-700 bg-slate-950/50 p-3 overflow-y-auto max-h-96">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-2xl px-4 py-3 text-sm ${
                message.role === 'assistant' ? 'bg-slate-800 text-slate-200' : 'bg-cyan-500/15 text-cyan-100'
              }`}
            >
              <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">{message.role}</p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {loading && <p className="text-sm text-slate-400">Thinking...</p>}
        </div>
      </div>

      <div className="border-t border-slate-700 pt-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && sendQuestion(input)}
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
            placeholder="Ask about reports"
          />
          <button
            onClick={() => sendQuestion(input)}
            disabled={loading}
            className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ask
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Privacy: uses only report data you can access. No storage beyond session.
      </p>
    </div>
  );
}