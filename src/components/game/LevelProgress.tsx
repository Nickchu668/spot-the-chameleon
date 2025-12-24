import { TOTAL_LEVELS } from '@/lib/gameConfig';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface LevelProgressProps {
  currentLevel: number;
  className?: string;
  language?: 'en' | 'zh';
}

export function LevelProgress({ currentLevel, className, language = 'zh' }: LevelProgressProps) {
  const progress = (currentLevel / TOTAL_LEVELS) * 100;
  const label = language === 'zh' ? '關卡進度' : 'Level';

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Label */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium flex items-center gap-1">
          <Zap className="h-3 w-3 text-accent" />
          {label}
        </span>
        <span className="font-bold text-foreground">
          {currentLevel} / {TOTAL_LEVELS}
        </span>
      </div>
      
      {/* Energy Bar */}
      <div className="relative w-28 sm:w-32 h-4 bg-muted/50 rounded-full overflow-hidden border border-border/50 shadow-inner">
        {/* Progress fill */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-primary to-secondary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
        
        {/* Level markers */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: TOTAL_LEVELS - 1 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-background/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
