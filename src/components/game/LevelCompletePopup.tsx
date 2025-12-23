import { Language, t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCompletePopupProps {
  level: number;
  language: Language;
  onNext: () => void;
}

export function LevelCompletePopup({ level, language, onNext }: LevelCompletePopupProps) {
  const levelTitle = t('levelTitles', level, language);

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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold mb-6">
          {t('ui', 'level', language)} {level} ✓
        </div>

        {/* Next level button */}
        <Button
          onClick={onNext}
          size="lg"
          className={cn(
            "w-full rounded-full text-lg",
            "bg-gradient-to-r from-primary to-secondary",
            "hover:scale-105 transition-all duration-300"
          )}
        >
          {t('ui', 'nextLevel', language)}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
