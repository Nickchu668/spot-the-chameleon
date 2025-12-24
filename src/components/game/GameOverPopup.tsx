import { useState } from 'react';
import { Language, t, translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Trophy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from './Timer';
import { GameGrid } from './GameGrid';
import { ColorPair } from '@/lib/colorUtils';

interface GameOverPopupProps {
  level: number;
  language: Language;
  totalTimeMs: number;
  mistakes: number;
  variantIndex: number;
  colorPair: ColorPair;
  onMenu: () => void;
  onSubmitScore: (name: string) => Promise<void>;
}

export function GameOverPopup({ 
  level, 
  language, 
  totalTimeMs,
  mistakes,
  variantIndex,
  colorPair,
  onMenu,
  onSubmitScore,
}: GameOverPopupProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get rank title based on level reached
  const getRankTitle = (lvl: number): string => {
    const titles = translations.rankTitles[lvl as keyof typeof translations.rankTitles];
    return titles ? titles[language] : '';
  };

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitScore(name.trim());
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Score submission form */}
        {!submitted ? (
          <div className="mb-6 space-y-3">
            <Input
              type="text"
              placeholder={language === 'zh' ? '輸入你的名字' : 'Enter your name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="text-center rounded-full"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || isSubmitting}
              className="w-full rounded-full"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Trophy className="mr-2 h-5 w-5" />
              )}
              {language === 'zh' ? '上傳排行榜' : 'Submit Score'}
            </Button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-primary/10 rounded-2xl text-primary text-sm">
            {language === 'zh' ? '成績已上傳！' : 'Score submitted!'}
          </div>
        )}

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
