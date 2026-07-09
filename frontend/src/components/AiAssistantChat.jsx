// import { useState } from 'react';
// import { MessageCircle, X, Send } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';


// export function AIAssistant() {
//   const { user } = useAuth();
//   const [open, setOpen] = useState(false);

//   // Hide assistant if user is not logged in
//   if (!user) return null;

//   return (
//     <div className="fixed bottom-6 right-6 z-50">

//       {open ? (
//         <div className="mb-4 w-80 md:w-96 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">

//           <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
//             <h3 className="text-sm font-semibold text-slate-100">
//               AI Assistant
//             </h3>

//             <button
//               onClick={() => setOpen(false)}
//               className="rounded-full p-1 hover:bg-slate-800 transition"
//             >
//               <X size={18} className="text-slate-400" />
//             </button>
//           </div>


//           <div className="p-4">
//             <AiAssistantChat />
//           </div>

//         </div>
//       ) : (

//         <button
//           onClick={() => setOpen(true)}
//           className="flex items-center justify-center rounded-full bg-cyan-500 p-3 shadow-lg hover:bg-cyan-400 transition"
//           title="Open AI Assistant"
//         >
//           <MessageCircle size={22} className="text-slate-950" />
//         </button>

//       )}

//     </div>
//   );
// }



// export function AiAssistantChat() {

//   const [question, setQuestion] = useState('');
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content:
//         'Hello! I can help summarize weekly reports, team progress, blockers, and workload.'
//     }
//   ]);


//   const sendMessage = async () => {

//     if (!question.trim()) return;


//     const userMessage = {
//       role: 'user',
//       content: question
//     };


//     setMessages((prev) => [
//       ...prev,
//       userMessage
//     ]);


//     setQuestion('');


//     try {

//       const response = await fetch(
//         'http://localhost:5000/api/ai/ask',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           credentials: 'include',
//           body: JSON.stringify({
//             question
//           })
//         }
//       );


//       const data = await response.json();


//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content:
//             data.answer ||
//             'No response received.'
//         }
//       ]);


//     } catch (error) {

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content:
//             'AI service is currently unavailable.'
//         }
//       ]);

//     }

//   };


//   return (

//     <div className="space-y-3">

//       <div className="h-72 overflow-y-auto space-y-3">

//         {messages.map((message, index) => (

//           <div
//             key={index}
//             className={`rounded-xl p-3 text-sm ${
//               message.role === 'user'
//                 ? 'bg-cyan-500 text-slate-950 ml-8'
//                 : 'bg-slate-800 text-slate-200 mr-8'
//             }`}
//           >
//             {message.content}
//           </div>

//         ))}

//       </div>


//       <div className="flex gap-2">

//         <input
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') sendMessage();
//           }}
//           placeholder="Ask about team progress..."
//           className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-sm text-white outline-none"
//         />


//         <button
//           onClick={sendMessage}
//           className="rounded-xl bg-cyan-500 px-3"
//         >
//           <Send size={18} />
//         </button>

//       </div>

//     </div>

//   );
// }   


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