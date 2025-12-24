import { cn } from '@/lib/utils';

interface ChameleonLogoProps {
  className?: string;
  animate?: boolean;
}

export function ChameleonLogo({ className, animate = false }: ChameleonLogoProps) {
  return (
    <div className={cn(
      "relative inline-flex items-center justify-center",
      animate && "chameleon-bounce",
      className
    )}>
      <span className="text-5xl md:text-6xl" role="img" aria-label="Chameleon">
        🦎
      </span>
      <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
    </div>
  );
}
