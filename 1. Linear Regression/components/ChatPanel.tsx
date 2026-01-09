
import React, { useState, useEffect, useRef } from 'react';
import { Step, ChatMessage } from '../types';
import { STEP_METADATA } from '../constants';
import { getOracleResponse } from '../services/geminiService';

interface ChatPanelProps {
  currentStep: Step;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ currentStep, onNextStep, onPrevStep }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const meta = STEP_METADATA[currentStep];
    // Reset or update based on step
    setMessages([{ role: 'model', text: meta.instruction }]);
  }, [currentStep]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text: string, useThinking = false) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setIsLoading(true);
    const response = await getOracleResponse(text, messages, currentStep, useThinking);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const metadata = STEP_METADATA[currentStep];

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xs text-white shadow-lg">LR</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Linear Regression Guide</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Phase {currentStep}: {metadata.title}</p>
          </div>
        </div>
      </div>

      {/* Step Goal Area */}
      <div className="bg-blue-50/80 px-6 py-4 border-b border-blue-100">
        <div className="flex items-center gap-2 mb-1">
           <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
           <p className="text-[10px] font-bold text-blue-800 uppercase tracking-tighter">Current Objective</p>
        </div>
        <p className="text-xs text-blue-700 leading-normal font-medium">{metadata.description}</p>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse ml-2">Thinking...</div>}
      </div>

      {/* Input / Suggestions */}
      <div className="p-6 bg-white border-t border-slate-200">
        <div className="flex flex-wrap gap-2 mb-4">
          {metadata.questions.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)} className="text-[11px] px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all font-semibold">
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)} placeholder="Ask a question..." className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={() => handleSend(inputValue)} className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={onPrevStep} disabled={currentStep === Step.SCATTER} className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg ${currentStep === Step.SCATTER ? 'text-slate-300' : 'text-slate-500 hover:text-slate-900'}`}>Back</button>
          <button onClick={onNextStep} disabled={currentStep === Step.PREDICTION} className={`text-xs font-bold uppercase tracking-widest bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-xl transition-all active:scale-95 ${currentStep === Step.PREDICTION ? 'opacity-30 cursor-not-allowed' : ''}`}>Next Step</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
