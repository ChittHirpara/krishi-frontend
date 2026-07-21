import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { cn } from '../../utils';

interface VoiceMicProps {
  onTranscription: (text: string) => void;
  language: string;
}

export function VoiceMic({ onTranscription, language }: VoiceMicProps) {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    if (isListening) return;
    setIsListening(true);
    
    setTimeout(() => {
      setIsListening(false);
      let text = "What is the treatment for Early Blight?";
      if (language === 'HI') text = "इसका इलाज क्या है?";
      if (language === 'GU') text = "આનો ઈલાજ શું છે?";
      onTranscription(text);
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full transition-all",
        isListening 
          ? "bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400 animate-pulse scale-110" 
          : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
      )}
      title="Speak"
      type="button"
    >
      <Mic className={cn("w-5 h-5", isListening && "animate-bounce")} />
    </button>
  );
}
