import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export function AIAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Hide assistant if user is not logged in
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {open ? (
        <div className="mb-4 w-80 md:w-96 rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">

          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-100">
              AI Assistant
            </h3>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-slate-800 transition"
            >
              <X size={18} className="text-slate-400" />
            </button>
          </div>


          <div className="p-4">
            <AiAssistantChat />
          </div>

        </div>
      ) : (

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center rounded-full bg-cyan-500 p-3 shadow-lg hover:bg-cyan-400 transition"
          title="Open AI Assistant"
        >
          <MessageCircle size={22} className="text-slate-950" />
        </button>

      )}

    </div>
  );
}



export function AiAssistantChat() {

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I can help summarize weekly reports, team progress, blockers, and workload.'
    }
  ]);


  const sendMessage = async () => {

    if (!question.trim()) return;


    const userMessage = {
      role: 'user',
      content: question
    };


    setMessages((prev) => [
      ...prev,
      userMessage
    ]);


    setQuestion('');


    try {

      const response = await fetch(
        'http://localhost:5000/api/ai/ask',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            question
          })
        }
      );


      const data = await response.json();


      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.answer ||
            'No response received.'
        }
      ]);


    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'AI service is currently unavailable.'
        }
      ]);

    }

  };


  return (

    <div className="space-y-3">

      <div className="h-72 overflow-y-auto space-y-3">

        {messages.map((message, index) => (

          <div
            key={index}
            className={`rounded-xl p-3 text-sm ${
              message.role === 'user'
                ? 'bg-cyan-500 text-slate-950 ml-8'
                : 'bg-slate-800 text-slate-200 mr-8'
            }`}
          >
            {message.content}
          </div>

        ))}

      </div>


      <div className="flex gap-2">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Ask about team progress..."
          className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        />


        <button
          onClick={sendMessage}
          className="rounded-xl bg-cyan-500 px-3"
        >
          <Send size={18} />
        </button>

      </div>

    </div>

  );
}