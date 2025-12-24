import { Language, t } from '@/lib/i18n';
import { translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Link, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { formatTime } from './Timer';
import { cn } from '@/lib/utils';

interface ShareableCardProps {
  name: string;
  level: number;
  totalTimeMs: number;
  language: Language;
}

export function ShareableCard({ name, level, totalTimeMs, language }: ShareableCardProps) {
  const [copied, setCopied] = useState(false);
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
    <div className="space-y-4">
      {/* Achievement Card */}
      <div 
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-2xl p-6",
          "bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20",
          "border-2 border-primary/30",
          "shadow-xl"
        )}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-3">
          {/* Logo / Icon */}
          <div className="text-5xl mb-2">🦎✨</div>
          
          {/* Player name */}
          <h3 className="text-2xl font-black text-primary truncate">
            {name}
          </h3>
          
          {/* Achievement badge */}
          <div className="inline-block bg-primary/20 rounded-full px-4 py-1">
            <span className="text-sm font-bold text-primary">
              {t('ui', 'level', language)} {level}
            </span>
          </div>
          
          {/* Rank title */}
          <p className="text-xl font-bold text-accent">
            {getRankTitle(level)}
          </p>
          
          {/* Time */}
          <p className="text-sm text-muted-foreground">
            ⏱️ {formatTime(totalTimeMs)}
          </p>
          
          {/* Game branding */}
          <p className="text-xs text-muted-foreground/70 mt-4">
            {language === 'zh' ? '變色龍挑戰' : 'Chameleon Challenge'}
          </p>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {/* Native share (mobile) */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <Button
            onClick={handleNativeShare}
            variant="default"
            size="sm"
            className="rounded-full"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {language === 'zh' ? '分享' : 'Share'}
          </Button>
        )}

        {/* Twitter/X */}
        <Button
          onClick={handleShareTwitter}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <Twitter className="mr-2 h-4 w-4" />
          X
        </Button>

        {/* Facebook */}
        <Button
          onClick={handleShareFacebook}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>

        {/* Copy link */}
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              {language === 'zh' ? '已複製' : 'Copied'}
            </>
          ) : (
            <>
              <Link className="mr-2 h-4 w-4" />
              {language === 'zh' ? '複製連結' : 'Copy Link'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
