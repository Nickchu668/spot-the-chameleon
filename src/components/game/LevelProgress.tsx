import { TOTAL_LEVELS } from '@/lib/gameConfig';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  currentLevel: number;
  className?: string;
}

export function LevelProgress({ currentLevel, className }: LevelProgressProps) {
  const progress = (currentLevel / TOTAL_LEVELS) * 100;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">{currentLevel}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-lg text-muted-foreground">{TOTAL_LEVELS}</span>
      </div>
      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
