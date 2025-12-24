import { useState, useEffect } from 'react';
import { Language, t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, Play } from 'lucide-react';
import LV5 from '@/assets/levels/LV5.jpeg';

interface AdBreakScreenProps {
  language: Language;
  onContinue: () => void;
}

export function AdBreakScreen({ language, onContinue }: AdBreakScreenProps) {
  const [countdown, setCountdown] = useState(10);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className={cn(
        "glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full text-center",
        "animate-scale-in"
      )}>
        {/* Eye rest icon */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 mb-4">
            <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black gradient-text mb-2 sm:mb-3">
          {language === 'zh' ? '👁️ 眼睛休息時間' : '👁️ Eye Break Time'}
        </h2>

        {/* Message */}
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          {language === 'zh' 
            ? '恭喜完成前5關！讓眼睛休息一下，準備迎接更高難度的挑戰！' 
            : 'Congratulations on completing 5 levels! Rest your eyes before the harder challenges ahead!'}
        </p>

        {/* Level 5 chameleon image */}
        <div className="mb-4 sm:mb-6">
          <img
            src={LV5}
            alt="Level 5 Chameleon"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl mx-auto shadow-lg border-2 border-primary/30"
          />
        </div>

        {/* Tips */}
        <div className="bg-accent/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-left">
          <h3 className="font-bold text-accent text-sm sm:text-base mb-2">
            {language === 'zh' ? '💡 護眼小提示：' : '💡 Eye Care Tips:'}
          </h3>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <li>{language === 'zh' ? '• 看看遠處的景物' : '• Look at something far away'}</li>
            <li>{language === 'zh' ? '• 閉眼深呼吸幾次' : '• Close your eyes and take deep breaths'}</li>
            <li>{language === 'zh' ? '• 眨眨眼睛保持濕潤' : '• Blink to keep your eyes moist'}</li>
          </ul>
        </div>

        {/* Countdown or Continue button */}
        {canSkip ? (
          <Button
            onClick={onContinue}
            size="lg"
            className={cn(
              "w-full rounded-full text-base sm:text-lg",
              "bg-gradient-to-r from-primary to-secondary",
              "hover:scale-105 transition-all duration-300"
            )}
          >
            <Play className="mr-2 h-5 w-5" />
            {language === 'zh' ? '繼續挑戰' : 'Continue'}
          </Button>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-2">
              <span className="text-2xl sm:text-3xl font-black text-primary">{countdown}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === 'zh' ? '秒後可繼續' : 'seconds until continue'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
