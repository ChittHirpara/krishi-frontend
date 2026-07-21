import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Plus, Trash2, Leaf, ExternalLink } from 'lucide-react';
import { VoiceMic } from '../../../components/ui/VoiceMic';
import { useLanguage } from '../../../context/LanguageContext';
import { cn } from '../../../utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: {
    name: string;
    crop?: string;
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

const mockResponses: Record<string, {text: string, source?: {name: string, crop: string}}> = {
  "What is the treatment for Early Blight?": {
    text: "For Early Blight in Tomatoes, the recommended chemical treatment is Chlorothalonil 75% WP (2g per liter of water). Ensure you observe a 7-day pre-harvest interval. For an organic approach, Copper Soap sprayed every 7-10 days is effective.",
    source: { name: "Early Blight Protocol", crop: "Tomato" }
  },
  "इसका इलाज क्या है?": {
    text: "टमाटर में अगेती झुलसा (Early Blight) के लिए, अनुशंसित रासायनिक उपचार क्लोरोथालोनिल 75% WP (2 ग्राम प्रति लीटर पानी) है। जैविक दृष्टिकोण के लिए, हर 7-10 दिनों में कॉपर सोप का छिड़काव प्रभावी है।",
    source: { name: "Early Blight Protocol", crop: "Tomato" }
  },
  "Is this safe for organic farming?": {
    text: "Yes, you can use Copper Soap as a safe organic alternative. Avoid synthetic fungicides like Chlorothalonil if you are strictly practicing organic farming."
  },
  "How do I prevent this next season?": {
    text: "To prevent Early Blight next season, rotate your crops (avoid planting tomatoes or potatoes in the same spot), ensure good air circulation between plants, and avoid overhead irrigation to keep the leaves dry."
  }
};

const defaultResponse = "I'm here to help! Could you provide a bit more detail about your crop or the issue you're facing?";

export function Assistant() {
  const { language } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', title: 'Early Blight Treatment', messages: [
      { id: 'm1', role: 'user', content: 'What is the treatment for Early Blight?' },
      { id: 'm2', role: 'assistant', content: 'For Early Blight in Tomatoes, the recommended chemical treatment is Chlorothalonil 75% WP (2g per liter of water). Ensure you observe a 7-day pre-harvest interval. For an organic approach, Copper Soap sprayed every 7-10 days is effective.', source: { name: "Early Blight Protocol", crop: "Tomato" } }
    ]},
    { id: '2', title: 'Is this safe for organic farming?', messages: [
      { id: 'm3', role: 'user', content: 'Is this safe for organic farming?' },
      { id: 'm4', role: 'assistant', content: 'Yes, you can use Copper Soap as a safe organic alternative. Avoid synthetic fungicides like Chlorothalonil if you are strictly practicing organic farming.' }
    ]}
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, streamingMessage]);

  const quickQuestions = language === 'HI' 
    ? ["इसका इलाज क्या है?", "क्या यह जैविक खेती के लिए सुरक्षित है?", "मैं अगली बार इसे कैसे रोकूँ?"]
    : ["What is the treatment for Early Blight?", "Is this safe for organic farming?", "How do I prevent this next season?"];

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    
    // Update session
    let updatedSessions = [...sessions];
    const sessionIndex = updatedSessions.findIndex(s => s.id === activeSessionId);
    
    if (sessionIndex > -1) {
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        title: updatedSessions[sessionIndex].messages.length === 0 ? text : updatedSessions[sessionIndex].title,
        messages: [...updatedSessions[sessionIndex].messages, newUserMsg]
      };
    }
    
    setSessions(updatedSessions);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseData = mockResponses[text] || { text: defaultResponse };
      simulateStreaming(responseData);
    }, 1000);
  };

  const simulateStreaming = (responseData: {text: string, source?: any}) => {
    const words = responseData.text.split(' ');
    let currentIndex = 0;
    
    const streamId = Date.now().toString();
    setStreamingMessage({
      id: streamId,
      role: 'assistant',
      content: '',
      source: responseData.source
    });

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamingMessage(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            content: prev.content + (currentIndex === 0 ? '' : ' ') + words[currentIndex]
          };
        });
        currentIndex++;
      } else {
        clearInterval(interval);
        // Commit message to session
        setSessions(prev => {
          const newSessions = [...prev];
          const idx = newSessions.findIndex(s => s.id === activeSessionId);
          if (idx > -1) {
            newSessions[idx] = {
              ...newSessions[idx],
              messages: [...newSessions[idx].messages, {
                id: streamId,
                role: 'assistant',
                content: responseData.text,
                source: responseData.source
              }]
            };
          }
          return newSessions;
        });
        setStreamingMessage(null);
      }
    }, 50); // 50ms per word
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter(s => s.id !== id);
    if (remaining.length === 0) {
      const newSession: ChatSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    } else {
      setSessions(remaining);
      if (activeSessionId === id) setActiveSessionId(remaining[0].id);
    }
  };

  return (
    <div className="flex h-full max-h-full overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl border border-[var(--color-border)] relative">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/20 dark:bg-black/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "absolute md:relative z-30 w-64 h-full bg-neutral-50 dark:bg-neutral-950 border-r border-[var(--color-border)] flex flex-col transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-[var(--color-border)]">
          <button
            onClick={createNewSession}
            className="w-full flex items-center gap-2 justify-center py-2 px-4 bg-white dark:bg-neutral-900 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-3 rounded-xl flex items-center justify-between group cursor-pointer transition-colors",
                activeSessionId === session.id
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
              )}
            >
              <div className="truncate text-sm font-medium flex-1 pr-2">{session.title}</div>
              <button 
                onClick={(e) => deleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-[var(--color-border)] flex items-center px-4 gap-3 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="bg-[var(--color-primary)]/10 p-1.5 rounded-lg">
            <Leaf className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100">Krishi Assistant</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeSession?.messages.length === 0 && !streamingMessage && !isTyping ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <Leaf className="w-12 h-12 text-[var(--color-primary)]" />
              <p className="text-sm font-medium">How can I help with your crops today?</p>
            </div>
          ) : (
            <>
              {activeSession?.messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 mt-1">
                    <Leaf className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 min-h-[44px]">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              {streamingMessage && <ChatMessage message={streamingMessage} isStreaming />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--color-border)] bg-white dark:bg-neutral-900 shrink-0">
          {/* Quick Questions */}
          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-hide">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-full text-xs font-semibold transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-3xl border border-transparent focus-within:border-[var(--color-primary)]/50 transition-colors flex items-center px-4">
              <textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question..."
                className="w-full bg-transparent border-none py-3 focus:outline-none resize-none max-h-32 text-sm text-gray-900 dark:text-gray-100"
                rows={1}
                style={{ minHeight: '44px' }}
              />
            </div>
            
            <VoiceMic onTranscription={(text) => handleSend(text)} language={language} />
            
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5 -ml-1 mt-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatMessage: React.FC<{ message: Message, isStreaming?: boolean }> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex items-start gap-3 w-full", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 mt-1">
          <Leaf className="w-4 h-4 text-[var(--color-primary)]" />
        </div>
      )}
      
      <div className={cn("flex flex-col gap-2 max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser 
            ? "bg-[var(--color-primary)] text-white rounded-tr-sm" 
            : "bg-neutral-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
        )}>
          {message.content}
          {isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-[var(--color-primary)] animate-pulse" />}
        </div>
        
        {message.source && (
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 px-2.5 py-1.5 rounded-lg">
            <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400">
              Source: {message.source.name} {message.source.crop && `(${message.source.crop})`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
