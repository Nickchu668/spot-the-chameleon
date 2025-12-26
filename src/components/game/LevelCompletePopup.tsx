import { useState, useEffect } from 'react';
import { Language, t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCompletePopupProps {
  level: number;
  language: Language;
  onNext: () => void;
  onLeaderboard: () => void;
}

export function LevelCompletePopup({ level, language, onNext, onLeaderboard }: LevelCompletePopupProps) {
  const levelTitle = t('levelTitles', level, language);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={cn(
        "glass-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center",
        "animate-scale-in"
      )}>
        {/* Chameleon celebration */}
        <div className="text-6xl mb-4 chameleon-bounce">
          🦎
        </div>

        {/* Level title */}
        <h2 className="text-3xl font-black gradient-text mb-2">
          {levelTitle}!
        </h2>

        <p className="text-muted-foreground mb-6">
          {t('messages', 'levelComplete', language)}
        </p>

        {/* Level badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold mb-4">
          {t('ui', 'level', language)} {level} ✓
        </div>

        {/* Countdown */}
        <div className="mb-6 text-center">
          <div className="text-4xl font-black text-accent mb-2">{countdown}</div>
          <p className="text-sm text-muted-foreground">
            {countdown}{t('messages', 'autoNextIn', language)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onLeaderboard}
            size="lg"
            variant="outline"
            className="flex-1 rounded-full"
          >
            <Trophy className="mr-2 h-5 w-5" />
            {t('ui', 'leaderboard', language)}
          </Button>
          <Button
            onClick={onNext}
            size="lg"
            className={cn(
              "flex-1 rounded-full",
              "bg-gradient-to-r from-primary to-secondary",
              "hover:scale-105 transition-all duration-300"
            )}
          >
            {t('ui', 'nextLevel', language)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
