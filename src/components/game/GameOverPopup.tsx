import { Language, t, translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from './Timer';
import { GameGrid } from './GameGrid';
import { ColorPair } from '@/lib/colorUtils';

interface GameOverPopupProps {
  level: number;
  language: Language;
  totalTimeMs: number;
  variantIndex: number;
  colorPair: ColorPair;
  onMenu: () => void;
}

export function GameOverPopup({ 
  level, 
  language, 
  totalTimeMs,
  variantIndex,
  colorPair,
  onMenu,
}: GameOverPopupProps) {
  // Get rank title based on level reached
  const getRankTitle = (lvl: number): string => {
    const titles = translations.rankTitles[lvl as keyof typeof translations.rankTitles];
    return titles ? titles[language] : '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm overflow-auto p-4">
      <div className={cn(
        "glass-card rounded-3xl p-8 max-w-md w-full text-center",
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

        {/* Level reached and rank title */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-1">
            {t('ui', 'level', language)} {level}
          </p>
          <p className="text-xl font-bold text-accent">
            {getRankTitle(level)}
          </p>
        </div>

        {/* Show correct answer on grid */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            {t('messages', 'correctAnswer', language)}
          </p>
          <div className="flex justify-center transform scale-75 origin-center">
            <GameGrid
              level={level}
              colorPair={colorPair}
              variantIndex={variantIndex}
              onTileClick={() => {}}
              successTile={variantIndex}
              failTile={null}
              clickedTiles={new Set()}
            />
          </div>
        </div>

        {/* Score display */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">
            {t('messages', 'gameOverScore', language)}
          </p>
          <p className="text-3xl font-black font-mono text-primary">
            {formatTime(totalTimeMs)}
          </p>
        </div>

        {/* Info about not being able to submit */}
        <div className="mb-6 p-4 bg-muted/30 rounded-2xl text-muted-foreground text-sm">
          {language === 'zh' 
            ? '遊戲結束無法上傳排行榜，只有通關才能上榜！' 
            : 'Game over - only completed games can be submitted to leaderboard!'}
        </div>

        {/* Menu button */}
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
  );
}
