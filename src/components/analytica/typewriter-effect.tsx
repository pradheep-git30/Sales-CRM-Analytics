'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterEffectProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterEffect({ text, className, speed = 20 }: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    let i = 0;
    
    if (!text) {
        setIsFinished(true);
        return;
    };

    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        setIsFinished(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <p className={cn('text-foreground leading-relaxed', className)}>
      {displayedText}
      <span
        className={cn(
          'inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse',
          { 'hidden': isFinished }
        )}
      />
    </p>
  );
}
