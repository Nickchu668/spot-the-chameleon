import { Language, t, translations } from '@/lib/i18n';
import { ChameleonLogo } from './ChameleonLogo';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Play, Trophy, Info, Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from './Leaderboard';
import { formatTime } from './Timer';

interface StartMenuProps {
  language: Language;
  onToggleLanguage: () => void;
  onStart: () => void;
  onLeaderboard: () => void;
  bestTimeMs: number | null;
  topThree: LeaderboardEntry[];
}

// Get rank title based on leaderboard position
const getLeaderboardTitle = (rank: number, language: Language): string => {
  const titleMap: Record<number, keyof typeof translations.rankTitles> = {
    1: 10, 2: 9, 3: 8,
  };
  const titleLevel = titleMap[rank] || 1;
  const titles = translations.rankTitles[titleLevel];
  return titles ? titles[language] : '';
};

export function StartMenu({
  language,
  onToggleLanguage,
  onStart,
  onLeaderboard,
  bestTimeMs,
  topThree,
}: StartMenuProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

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

      {/* TOP 3 Leaderboard */}
      {topThree.length > 0 && (
        <div 
          className="glass-card rounded-2xl p-6 mt-6 max-w-md w-full animate-fade-in-up"
          style={{ animationDelay: '0.25s' }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            TOP 3
          </h2>
          <div className="space-y-3">
            {topThree.map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  index === 0 && "bg-yellow-500/10",
                  index === 1 && "bg-gray-400/10",
                  index === 2 && "bg-amber-600/10"
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  {getRankIcon(index + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-semibold truncate",
                    index === 0 && "text-yellow-400",
                    index === 1 && "text-gray-300",
                    index === 2 && "text-amber-600"
                  )}>
                    {entry.name}
                  </div>
                  <div className="text-xs text-accent">
                    {getLeaderboardTitle(index + 1, language)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">
                    {formatTime(entry.total_time_ms)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lv.{(entry as any).level || 10}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules */}
      <div 
        className="glass-card rounded-2xl p-6 mt-6 max-w-md w-full animate-fade-in-up"
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
