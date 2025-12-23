import { Language, t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameOverPopupProps {
  level: number;
  language: Language;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverPopup({ level, language, onRetry, onMenu }: GameOverPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={cn(
        "glass-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center",
        "animate-scale-in"
      )}>
        {/* Sad chameleon */}
        <div className="text-6xl mb-4">
          😢🦎
        </div>

        <h2 className="text-3xl font-black text-destructive mb-2">
          {t('messages', 'gameOver', language)}
        </h2>

        <p className="text-muted-foreground mb-2">
          {t('messages', 'noMistakes', language)}
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          {t('ui', 'level', language)} {level}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onRetry}
            size="lg"
            className={cn(
              "w-full rounded-full text-lg",
              "bg-gradient-to-r from-primary to-secondary",
              "hover:scale-105 transition-all duration-300"
            )}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            {t('messages', 'tryAgain', language)}
          </Button>

          <Button
            onClick={onMenu}
            variant="outline"
            size="lg"
            className="w-full rounded-full"
          >
            <Home className="mr-2 h-5 w-5" />
            {t('ui', 'menu', language)}
          </Button>
        </div>
      </div>
    </div>
  );
}
