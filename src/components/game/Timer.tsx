import { cn } from '@/lib/utils';

interface TimerProps {
  timeMs: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function Timer({ timeMs, label, className, size = 'md' }: TimerProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {label && (
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      )}
      <span className={cn(
        "font-bold font-mono",
        sizeClasses[size]
      )}>
        {formatTime(timeMs)}
      </span>
    </div>
  );
}
