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
  completedLevel: number;
  language: Language;
  totalTimeMs: number;
  bestTimeMs: number | null;
  mistakes: number;
  variantIndex: number;
  colorPair: ColorPair;
  onMenu: () => void;
  onSubmitScore: (name: string) => Promise<void>;
}

export function GameOverPopup({ 
  level, 
  completedLevel,
  language, 
  totalTimeMs,
  bestTimeMs,
  mistakes,
  variantIndex,
  colorPair,
  onMenu,
  onSubmitScore,
}: GameOverPopupProps) {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
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
      setSubmittedName(name.trim());
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
            {language === 'zh' ? '挑戰失敗於' : 'Failed at'} {t('ui', 'level', language)} {level}
          </p>
          <p className="text-lg font-bold text-primary mt-2">
            {language === 'zh' ? '上傳成績：' : 'Submitted:'} {t('ui', 'level', language)} {completedLevel}
          </p>
          <p className="text-xl font-bold text-accent">
            {getRankTitle(completedLevel)}
          </p>
        </div>

        {/* Show correct answer on grid */}
        <div className="mb-2">
          <p className="text-sm text-muted-foreground mb-1">
            {t('messages', 'correctAnswer', language)}
          </p>
          <div className="flex justify-center transform scale-[0.6] origin-center -my-4">
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

        {/* Score display - compact */}
        <div className="bg-muted/50 rounded-2xl p-3 mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('messages', 'gameOverScore', language)}
            </span>
            <span className="text-xl font-black font-mono text-primary">
              {formatTime(totalTimeMs)}
            </span>
            {bestTimeMs !== null && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">
                  {language === 'zh' ? '最佳' : 'Best'}
                </span>
                <span className="font-mono font-bold text-accent">
                  {formatTime(bestTimeMs)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Score submission form */}
        <div className="mb-6 space-y-3">
          <Input
            type="text"
            placeholder={language === 'zh' ? '輸入你的名字' : 'Enter your name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="text-center rounded-full"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={submitted}
          />
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting || submitted}
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
