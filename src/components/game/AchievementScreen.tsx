import { Language, t, translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Download, Twitter, Facebook, Link, Check, Home, Share2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { formatTime } from './Timer';
import { cn } from '@/lib/utils';
import { Confetti } from './Confetti';
import html2canvas from 'html2canvas';

interface AchievementScreenProps {
  name: string;
  level: number;
  totalTimeMs: number;
  language: Language;
  onMenu: () => void;
}

export function AchievementScreen({ name, level, totalTimeMs, language, onMenu }: AchievementScreenProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get rank title based on level
  const getRankTitle = (lvl: number): string => {
    const titles = translations.rankTitles[lvl as keyof typeof translations.rankTitles];
    return titles ? titles[language] : '';
  };

  const shareUrl = window.location.origin;
  const shareText = language === 'zh' 
    ? `🦎 我在變色龍挑戰中達到了 ${t('ui', 'level', language)} ${level}！我的稱號是「${getRankTitle(level)}」，用時 ${formatTime(totalTimeMs)}。你能超越我嗎？`
    : `🦎 I reached Level ${level} in the Chameleon Challenge! My rank: "${getRankTitle(level)}" in ${formatTime(totalTimeMs)}. Can you beat me?`;

  const handleDownloadImage = async () => {
    if (!cardRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `chameleon-challenge-${name}-level${level}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 overflow-auto p-4">
      <Confetti active={true} />
      
      <div className="max-w-md w-full space-y-6 animate-scale-in">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-primary mb-2">
            {language === 'zh' ? '🎉 恭喜！' : '🎉 Congratulations!'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'zh' ? '你的成績已上傳排行榜！' : 'Your score has been submitted!'}
          </p>
        </div>

        {/* Achievement Card - This is what gets captured as image */}
        <div 
          ref={cardRef}
          className={cn(
            "relative overflow-hidden rounded-2xl p-6",
            "bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30",
            "border-2 border-primary/40",
            "shadow-2xl"
          )}
          style={{ backgroundColor: 'hsl(var(--background))' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 text-center space-y-4">
            {/* Logo / Icon */}
            <div className="text-6xl mb-2">🦎✨</div>
            
            {/* Player name */}
            <h3 className="text-3xl font-black text-primary truncate px-2">
              {name}
            </h3>
            
            {/* Achievement badge */}
            <div className="inline-block bg-primary/25 rounded-full px-6 py-2 border border-primary/30">
              <span className="text-lg font-bold text-primary">
                {t('ui', 'level', language)} {level}
              </span>
            </div>
            
            {/* Rank title */}
            <p className="text-2xl font-bold text-accent">
              {getRankTitle(level)}
            </p>
            
            {/* Time */}
            <div className="bg-background/50 rounded-xl py-3 px-4 inline-block">
              <p className="text-lg font-mono font-bold text-foreground">
                ⏱️ {formatTime(totalTimeMs)}
              </p>
            </div>
            
            {/* Game branding */}
            <p className="text-sm text-muted-foreground pt-2">
              {language === 'zh' ? '變色龍挑戰' : 'Chameleon Challenge'}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          size="lg"
          className="w-full rounded-full text-lg py-6"
        >
          <Download className="mr-2 h-5 w-5" />
          {isDownloading 
            ? (language === 'zh' ? '生成中...' : 'Generating...') 
            : (language === 'zh' ? '下載成績圖片' : 'Download Achievement Image')
          }
        </Button>

        {/* Share buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              onClick={handleNativeShare}
              variant="secondary"
              size="lg"
              className="rounded-full"
            >
              <Share2 className="mr-2 h-5 w-5" />
              {language === 'zh' ? '分享' : 'Share'}
            </Button>
          )}

          {/* Twitter/X */}
          <Button
            onClick={handleShareTwitter}
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <Twitter className="mr-2 h-5 w-5" />
            X
          </Button>

          {/* Facebook */}
          <Button
            onClick={handleShareFacebook}
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <Facebook className="mr-2 h-5 w-5" />
            FB
          </Button>

          {/* Copy link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5 text-green-500" />
                {language === 'zh' ? '已複製' : 'Copied'}
              </>
            ) : (
              <>
                <Link className="mr-2 h-5 w-5" />
                {language === 'zh' ? '複製' : 'Copy'}
              </>
            )}
          </Button>
        </div>

        {/* Menu button */}
        <Button
          onClick={onMenu}
          variant="ghost"
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
