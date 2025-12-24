import { Language, t } from '@/lib/i18n';
import { ChameleonLogo } from './ChameleonLogo';
import { LanguageToggle } from './LanguageToggle';
import { LevelProgress } from './LevelProgress';
import { Timer, formatTime } from './Timer';
import { MistakesDisplay } from './MistakesDisplay';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  currentLevel: number;
  totalTimeMs: number;
  bestTimeMs: number | null;
  mistakes: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameHeader({
  language,
  onToggleLanguage,
  currentLevel,
  totalTimeMs,
  bestTimeMs,
  mistakes,
  soundEnabled,
  onToggleSound,
  onRestart,
  onMenu,
}: GameHeaderProps) {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40",
      "glass-card px-4 py-3",
      "flex items-center justify-between gap-2 flex-wrap"
    )}>
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="hover:scale-110 transition-transform">
          <ChameleonLogo className="scale-75" />
        </button>
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
      </div>

      {/* Center section */}
      <div className="flex items-center gap-4 md:gap-6">
        <LevelProgress currentLevel={currentLevel} language={language} />
        <Timer timeMs={totalTimeMs} label={t('ui', 'time', language)} />
        {bestTimeMs && (
          <div className="hidden md:flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {t('ui', 'bestTime', language)}
            </span>
            <span className="text-sm font-mono text-accent">
              {formatTime(bestTimeMs)}
            </span>
          </div>
        )}
        <MistakesDisplay mistakes={mistakes} />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          className="h-9 w-9"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className="h-9 w-9"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenu}
          className="h-9 w-9"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
