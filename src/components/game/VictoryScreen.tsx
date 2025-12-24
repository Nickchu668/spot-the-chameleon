import { useState } from 'react';
import { Language, t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, formatTime } from './Timer';
import { Confetti } from './Confetti';
import { Trophy, Share2, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VictoryScreenProps {
  totalTimeMs: number;
  language: Language;
  onSubmitScore: (name: string) => Promise<number>;
  onRestart: () => void;
  onShare: () => void;
}

export function VictoryScreen({
  totalTimeMs,
  language,
  onSubmitScore,
  onRestart,
  onShare,
}: VictoryScreenProps) {
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [displayRank, setDisplayRank] = useState<number | null>(null);
  const [submittedName, setSubmittedName] = useState('');

  const handleSubmit = async () => {
    const nameToSubmit = nickname.trim() || defaultName;
    
    setIsSubmitting(true);
    try {
      const rank = await onSubmitScore(nameToSubmit);
      setSubmittedName(nameToSubmit);
      setDisplayRank(rank);
      setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultName = t('messages', 'mysteryPlayer', language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md overflow-auto p-4">
      <Confetti active={true} />
      
      <div className={cn(
        "glass-card rounded-3xl p-8 max-w-md w-full text-center",
        "animate-scale-in"
      )}>
        {/* Crown chameleon */}
        <div className="text-7xl mb-4 float-animation">
          👑🦎
        </div>

        {/* Victory message */}
        <h2 className="text-2xl md:text-3xl font-black gradient-text mb-2">
          {t('messages', 'congratulations', language)}
        </h2>

        <h3 className="text-xl font-bold text-accent mb-4">
          {t('victory', 'title', language)}
        </h3>

        {/* Final time */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">
            {t('ui', 'time', language)}
          </p>
          <p className="text-4xl font-black font-mono text-primary">
            {formatTime(totalTimeMs)}
          </p>
        </div>

        {/* Nickname input or rank display */}
        {!hasSubmitted ? (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              {t('messages', 'enterName', language)}
            </p>
            <div className="flex gap-2">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 12))}
                placeholder={defaultName}
                className="text-center rounded-full"
                maxLength={12}
              />
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-full px-6"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {t('ui', 'submit', language)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-primary/10 rounded-2xl p-4 animate-scale-in">
            <p className="text-xs text-muted-foreground mb-1">
              {language === 'zh' ? '你的排名' : 'Your Rank'}
            </p>
            <p className="text-3xl font-black text-primary">
              #{displayRank}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {submittedName}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onShare}
            variant="outline"
            className="w-full rounded-full"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t('ui', 'share', language)}
          </Button>

          <Button
            onClick={onRestart}
            className={cn(
              "w-full rounded-full",
              "bg-gradient-to-r from-primary to-secondary",
              "hover:scale-105 transition-all duration-300"
            )}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('ui', 'restart', language)}
          </Button>
        </div>
      </div>
    </div>
  );
}
