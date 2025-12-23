import { Language, t } from '@/lib/i18n';
import { ChameleonLogo } from './ChameleonLogo';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Play, Trophy, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StartMenuProps {
  language: Language;
  onToggleLanguage: () => void;
  onStart: () => void;
  onLeaderboard: () => void;
  bestTimeMs: number | null;
}

export function StartMenu({
  language,
  onToggleLanguage,
  onStart,
  onLeaderboard,
  bestTimeMs,
}: StartMenuProps) {
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      {/* Language toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
      </div>

      {/* Logo and title */}
      <div className="flex flex-col items-center gap-4 mb-8 animate-fade-in-up">
        <ChameleonLogo animate className="scale-150 mb-4" />
        <h1 className="text-4xl md:text-6xl font-black text-center gradient-text">
          {t('gameTitle', language)}
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          {t('messages', 'findDifferent', language)}
        </p>
      </div>

      {/* Start button */}
      <Button
        onClick={onStart}
        size="lg"
        className={cn(
          "text-xl px-10 py-7 rounded-full",
          "bg-gradient-to-r from-primary to-secondary",
          "hover:scale-105 transition-all duration-300",
          "glow-primary font-bold",
          "animate-fade-in-up",
          "animation-delay-100"
        )}
        style={{ animationDelay: '0.1s' }}
      >
        <Play className="mr-2 h-6 w-6" />
        {t('ui', 'start', language)}
      </Button>

      {/* Secondary actions */}
      <div 
        className="flex gap-4 mt-6 animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        <Button
          variant="outline"
          onClick={onLeaderboard}
          className="rounded-full"
        >
          <Trophy className="mr-2 h-4 w-4" />
          {t('ui', 'leaderboard', language)}
        </Button>
      </div>

      {/* Rules */}
      <div 
        className="glass-card rounded-2xl p-6 mt-8 max-w-md animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          {t('rules', 'title', language)}
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">1.</span>
            {t('rules', 'rule1', language)}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">2.</span>
            {t('rules', 'rule2', language)}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">3.</span>
            {t('rules', 'rule3', language)}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">4.</span>
            {t('rules', 'rule4', language)}
          </li>
        </ul>
      </div>

      {/* Best time badge */}
      {bestTimeMs && (
        <div 
          className="mt-6 px-4 py-2 rounded-full bg-accent/20 text-accent font-mono animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {t('ui', 'bestTime', language)}: {Math.floor(bestTimeMs / 60000)}:{String(Math.floor((bestTimeMs % 60000) / 1000)).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
