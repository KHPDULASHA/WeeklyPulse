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
  'What did the team complete this week?',
  'Who has blockers?',
  'Which project has highest workload?',
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
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }

      const response = await api.post('/ai/ask', { question: trimmed });
      setMessages((current) => [...current, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error.response?.data?.error || 'The assistant could not answer that request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">AI assistant</h3>
          <p className="text-sm text-slate-400">Ask questions about the latest weekly reports.</p>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Secure
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {starterQuestions.map((question) => (
          <button key={question} onClick={() => sendQuestion(question)} disabled={loading} className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
            {question}
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm ${message.role === 'assistant' ? 'bg-slate-800 text-slate-200' : 'bg-cyan-500/15 text-cyan-100'}`}>
            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">{message.role}</p>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {loading && <p className="text-sm text-slate-400">Thinking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && sendQuestion(input)}
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
          placeholder="Ask about this week’s reports"
        />
        <button onClick={() => sendQuestion(input)} disabled={loading} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
          Ask
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Privacy note: the assistant uses only submitted weekly report data you already have access to and does not store your chat prompts beyond the current session.
      </p>
    </div>
  );
}
