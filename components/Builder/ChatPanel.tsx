import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, Paperclip, Code2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ChatMessage } from '../../types';
import { clsx } from 'clsx';

interface ChatPanelProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ history, onSendMessage, isGenerating }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border w-[400px] shadow-xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-zinc-100 font-semibold">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span>DreamCraft AI</span>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">BETA</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Describe your dream app, and I'll build it.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 opacity-60">
            <Code2 size={48} className="mb-4 text-zinc-700" />
            <p>No messages yet.</p>
            <p className="text-sm">Start by describing an app.</p>
          </div>
        )}
        
        {history.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex flex-col max-w-[90%]",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div
              className={clsx(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700/50"
              )}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'AI Architect'}
            </span>
          </div>
        ))}
        
        {isGenerating && (
           <div className="flex flex-col items-start max-w-[90%]">
             <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-zinc-800 border border-zinc-700/50 flex items-center gap-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
             <span className="text-[10px] text-zinc-500 mt-1 px-1">Thinking...</span>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="relative flex items-end gap-2 bg-zinc-900/50 border border-zinc-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50 transition-all">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white h-8 w-8 mb-1">
            <Paperclip size={18} />
          </Button>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe your change..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-100 placeholder-zinc-500 resize-none py-2 max-h-[120px] min-h-[40px]"
            rows={1}
          />
          
          <div className="flex gap-1 mb-1">
             <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white h-8 w-8">
                <Mic size={18} />
             </Button>
             <Button 
                onClick={() => handleSubmit()} 
                disabled={!input.trim() || isGenerating}
                variant="primary" 
                size="icon" 
                className={clsx("h-8 w-8 transition-all", input.trim() ? "bg-blue-600 hover:bg-blue-500" : "bg-zinc-700 text-zinc-500")}
             >
                <Send size={16} />
             </Button>
          </div>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Add a dark mode toggle', 'Make buttons rounder', 'Add a footer'].map(suggestion => (
                <button 
                    key={suggestion}
                    onClick={() => {
                        setInput(suggestion);
                        if (textareaRef.current) textareaRef.current.focus();
                    }}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-full border border-zinc-700 transition-colors whitespace-nowrap"
                >
                    {suggestion}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};