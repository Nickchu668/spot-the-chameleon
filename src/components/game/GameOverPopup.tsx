import { useState } from 'react';
import { Language, t, translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Trophy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from './Timer';
import { GameGrid } from './GameGrid';
import { ColorPair } from '@/lib/colorUtils';

// Level images
import LV1 from '@/assets/levels/LV1.jpeg';
import LV2 from '@/assets/levels/LV2.jpeg';
import LV3 from '@/assets/levels/LV3.jpeg';
import LV4 from '@/assets/levels/LV4.jpeg';
import LV5 from '@/assets/levels/LV5.jpeg';
import LV6 from '@/assets/levels/LV6.jpeg';
import LV7 from '@/assets/levels/LV7.jpeg';
import LV8 from '@/assets/levels/LV8.jpeg';
import LV9 from '@/assets/levels/LV9.jpeg';
import LV10 from '@/assets/levels/LV10.jpeg';

const LEVEL_IMAGES: Record<number, string> = {
  1: LV1,
  2: LV2,
  3: LV3,
  4: LV4,
  5: LV5,
  6: LV6,
  7: LV7,
  8: LV8,
  9: LV9,
  10: LV10,
};

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
  onSubmitScore: (name: string) => Promise<number>;
  playerRank: number | null;
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
  playerRank,
}: GameOverPopupProps) {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [displayRank, setDisplayRank] = useState<number | null>(null);

  // Get rank title based on level reached
  const getRankTitle = (lvl: number): string => {
    const titles = translations.rankTitles[lvl as keyof typeof translations.rankTitles];
    return titles ? titles[language] : '';
  };

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const rank = await onSubmitScore(name.trim());
      setSubmittedName(name.trim());
      setDisplayRank(rank);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm overflow-auto py-2 px-3 sm:p-4 sm:items-center">
      <div className={cn(
        "glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full text-center my-auto",
        "animate-scale-in"
      )}>
        {/* Level image */}
        <div className="mb-2 sm:mb-3">
          <img 
            src={LEVEL_IMAGES[completedLevel] || LV1} 
            alt={`Level ${completedLevel} Chameleon`}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-lg border-2 border-destructive/30 mx-auto"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-destructive mb-1 sm:mb-2">
          {t('messages', 'gameOver', language)}
        </h2>

        <p className="text-sm text-muted-foreground mb-2">
          {t('messages', 'noMistakes', language)}
        </p>

        {/* Level reached and rank title */}
        <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === 'zh' ? '挑戰失敗於' : 'Failed at'} {t('ui', 'level', language)} {level}
          </p>
          <p className="text-sm sm:text-base font-bold text-primary mt-1">
            {language === 'zh' ? '上傳成績：' : 'Submitted:'} {t('ui', 'level', language)} {completedLevel}
          </p>
          <p className="text-base sm:text-lg font-bold text-accent">
            {getRankTitle(completedLevel)}
          </p>
        </div>

        {/* Show correct answer on grid */}
        <div className="mb-0">
          <p className="text-xs sm:text-sm text-muted-foreground mb-0">
            {t('messages', 'correctAnswer', language)}
          </p>
          <div className="flex justify-center transform scale-[0.45] sm:scale-[0.5] origin-center -my-14 sm:-my-12">
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
        <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-3">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t('messages', 'gameOverScore', language)}
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-primary">
              {formatTime(totalTimeMs)}
            </span>
            {bestTimeMs !== null && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {language === 'zh' ? '最佳' : 'Best'}
                </span>
                <span className="font-mono font-bold text-accent text-sm sm:text-base">
                  {formatTime(bestTimeMs)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Score submission form */}
        <div className="mb-3 sm:mb-4 space-y-2">
          {submitted && displayRank !== null ? (
            <div className="bg-primary/10 rounded-xl p-3 animate-scale-in">
              <p className="text-xs text-muted-foreground mb-1">
                {language === 'zh' ? '你的排名' : 'Your Rank'}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-primary">
                #{displayRank}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {submittedName}
              </p>
            </div>
          ) : (
            <>
              <Input
                type="text"
                placeholder={language === 'zh' ? '輸入你的名字' : 'Enter your name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="text-center rounded-full h-9 sm:h-10 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={submitted}
              />
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting || submitted}
                className="w-full rounded-full h-9 sm:h-10 text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trophy className="mr-2 h-4 w-4" />
                )}
                {language === 'zh' ? '上傳排行榜' : 'Submit Score'}
              </Button>
            </>
          )}
        </div>

        {/* Menu button */}
        <Button
          onClick={onMenu}
          variant="outline"
          size="default"
          className="w-full rounded-full h-9 sm:h-10 text-sm"
        >
          <Home className="mr-2 h-4 w-4" />
          {t('ui', 'menu', language)}
        </Button>
      </div>
    </div>
  );
}
