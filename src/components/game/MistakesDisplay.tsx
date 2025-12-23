import { MAX_MISTAKES } from '@/lib/gameConfig';
import { cn } from '@/lib/utils';

interface MistakesDisplayProps {
  mistakes: number;
  className?: string;
}

export function MistakesDisplay({ mistakes, className }: MistakesDisplayProps) {
  const hearts = [];
  
  for (let i = 0; i < MAX_MISTAKES; i++) {
    const isLost = i < mistakes;
    hearts.push(
      <span
        key={i}
        className={cn(
          "text-xl transition-all duration-300",
          isLost && "opacity-30 scale-75 grayscale"
        )}
      >
        {isLost ? '🖤' : '❤️'}
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {hearts}
    </div>
  );
}
