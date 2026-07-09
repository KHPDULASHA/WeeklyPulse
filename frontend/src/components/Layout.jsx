import { AIAssistant } from './AiAssistantChat';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {children}
      <AIAssistant />
    </div>
  );
}