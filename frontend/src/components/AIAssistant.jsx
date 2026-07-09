import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AiAssistantChat } from './AiAssistantChat';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export function AIAssistant() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  if (location.pathname.startsWith('/auth')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {open ? (
        <div className="mb-4 w-80 md:w-96 rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">

          <div className="flex justify-between items-center p-4 border-b border-slate-800">
            <h3 className="text-white font-semibold">
              AI Assistant
            </h3>

            <button onClick={() => setOpen(false)}>
              <X size={18}/>
            </button>
          </div>

          <div className="p-4">
            <AiAssistantChat />
          </div>

        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-cyan-500 p-4"
        >
          <MessageCircle />
        </button>
      )}

    </div>
  );
}