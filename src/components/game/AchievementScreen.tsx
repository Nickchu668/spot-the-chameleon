import { Language, t, translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Link, Check, Home, Share2, Trophy } from 'lucide-react';
import { useState } from 'react';
import { formatTime } from './Timer';
import { cn } from '@/lib/utils';
import { Confetti } from './Confetti';

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

interface AchievementScreenProps {
  name: string;
  level: number;
  totalTimeMs: number;
  language: Language;
  onMenu: () => void;
  onLeaderboard: () => void;
  playerRank: number | null;
}

export function AchievementScreen({ name, level, totalTimeMs, language, onMenu, onLeaderboard, playerRank }: AchievementScreenProps) {
  const [copied, setCopied] = useState(false);

  // Get rank title based on level
  const getRankTitle = (lvl: number): string => {
    const titles = translations.rankTitles[lvl as keyof typeof translations.rankTitles];
    return titles ? titles[language] : '';
  };

  const shareUrl = window.location.origin;
  const shareText = language === 'zh' 
    ? `🦎 我在變色龍挑戰中達到了 ${t('ui', 'level', language)} ${level}！我的稱號是「${getRankTitle(level)}」，用時 ${formatTime(totalTimeMs)}。你能超越我嗎？`
    : `🦎 I reached Level ${level} in the Chameleon Challenge! My rank: "${getRankTitle(level)}" in ${formatTime(totalTimeMs)}. Can you beat me?`;


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'zh' ? '變色龍挑戰成績' : 'Chameleon Challenge Score',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center bg-gradient-to-br from-background via-background to-primary/10 overflow-auto py-3 px-3 sm:p-4">
      <Confetti active={true} />
      
      <div className="max-w-md w-full space-y-3 sm:space-y-6 animate-scale-in my-auto">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-primary mb-1 sm:mb-2">
            {language === 'zh' ? '🎉 恭喜！' : '🎉 Congratulations!'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === 'zh' ? '你的成績已上傳排行榜！' : 'Your score has been submitted!'}
          </p>
        </div>

        {/* Achievement Card */}
        <div
          className={cn(
            "relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6",
            "bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30",
            "border-2 border-primary/40",
            "shadow-2xl"
          )}
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-primary/5 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 text-center space-y-2 sm:space-y-4">
            {/* Level Image */}
            <div className="mb-1 sm:mb-2">
              <img 
                src={LEVEL_IMAGES[level] || LV1} 
                alt={`Level ${level} Chameleon`}
                className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl mx-auto shadow-lg border-2 border-primary/30"
              />
            </div>
            
            {/* Player name */}
            <h3 className="text-2xl sm:text-3xl font-black text-primary truncate px-2">
              {name}
            </h3>
            
            {/* Leaderboard rank */}
            {playerRank && (
              <div className="inline-block bg-accent/25 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 border border-accent/30">
                <span className="text-sm sm:text-lg font-bold text-accent">
                  🏆 {language === 'zh' ? `排行榜第 ${playerRank} 名` : `Rank #${playerRank}`}
                </span>
              </div>
            )}
            
            {/* Achievement badge */}
            <div className="inline-block bg-primary/25 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 border border-primary/30">
              <span className="text-base sm:text-lg font-bold text-primary">
                {t('ui', 'level', language)} {level}
              </span>
            </div>
            
            {/* Rank title */}
            <p className="text-lg sm:text-2xl font-bold text-accent">
              {getRankTitle(level)}
            </p>
            
            {/* Time */}
            <div className="bg-background/50 rounded-lg sm:rounded-xl py-2 sm:py-3 px-3 sm:px-4 inline-block">
              <p className="text-base sm:text-lg font-mono font-bold text-foreground">
                ⏱️ {formatTime(totalTimeMs)}
              </p>
            </div>
            
            {/* Game branding */}
            <p className="text-xs sm:text-sm text-muted-foreground pt-1 sm:pt-2">
              {language === 'zh' ? '變色龍挑戰' : 'Chameleon Challenge'}
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              onClick={handleNativeShare}
              variant="secondary"
              size="default"
              className="rounded-full h-9 sm:h-10 text-sm"
            >
              <Share2 className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {language === 'zh' ? '分享' : 'Share'}
            </Button>
          )}

          {/* Twitter/X */}
          <Button
            onClick={handleShareTwitter}
            variant="outline"
            size="default"
            className="rounded-full h-9 sm:h-10 text-sm"
          >
            <Twitter className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            X
          </Button>

          {/* Facebook */}
          <Button
            onClick={handleShareFacebook}
            variant="outline"
            size="default"
            className="rounded-full h-9 sm:h-10 text-sm"
          >
            <Facebook className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            FB
          </Button>

          {/* Copy link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="default"
            className="rounded-full h-9 sm:h-10 text-sm"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                {language === 'zh' ? '已複製' : 'Copied'}
              </>
            ) : (
              <>
                <Link className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {language === 'zh' ? '複製' : 'Copy'}
              </>
            )}
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onLeaderboard}
            variant="outline"
            size="default"
            className="flex-1 rounded-full h-9 sm:h-10 text-sm"
          >
            <Trophy className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t('ui', 'leaderboard', language)}
          </Button>
          <Button
            onClick={onMenu}
            size="default"
            className="flex-1 rounded-full h-9 sm:h-10 text-sm bg-accent hover:bg-accent/90"
          >
            <Home className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t('ui', 'menu', language)}
          </Button>
        </div>
      </div>
    </div>
  );
}
