import { useState } from 'react';
import { Language, t, translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Trophy, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from './Timer';
import { supabase } from '@/integrations/supabase/client';

interface GameOverPopupProps {
  level: number;
  language: Language;
  totalTimeMs: number;
  variantIndex: number;
  onMenu: () => void;
  onSubmitScore?: (name: string) => Promise<void>;
}

export function GameOverPopup({ 
  level, 
  language, 
  totalTimeMs,
  variantIndex,
  onMenu,
  onSubmitScore 
}: GameOverPopupProps) {
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Get rank title based on level reached
  const getRankTitle = (lvl: number): string => {
    const titles = translations.rankTitles[lvl as keyof typeof translations.rankTitles];
    return titles ? titles[language] : '';
  };

  const handleSubmit = async () => {
    if (!nickname.trim() || !onSubmitScore) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitScore(nickname.trim());
      setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) console.error('Google login error:', error);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) console.error('Facebook login error:', error);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const defaultName = t('messages', 'mysteryPlayer', language);

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

        {/* Correct answer indicator */}
        <div className="mb-4 p-3 bg-success/20 rounded-xl">
          <p className="text-sm text-success font-medium mb-2">
            {t('messages', 'correctAnswer', language)}
          </p>
          <p className="text-lg font-bold text-success">
            🎯 {language === 'zh' ? `第 ${variantIndex + 1} 格` : `Tile #${variantIndex + 1}`}
          </p>
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

        {/* Submit to leaderboard section */}
        {!hasSubmitted ? (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              {t('messages', 'submitToLeaderboard', language)}
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 12))}
                placeholder={defaultName}
                className="text-center rounded-full"
                maxLength={12}
              />
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !nickname.trim()}
                className="rounded-full px-6"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {t('ui', 'submit', language)}
              </Button>
            </div>

            {/* Social login options */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3">
                {t('messages', 'orLoginWith', language)}
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  variant="outline"
                  className="rounded-full flex-1"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  onClick={handleFacebookLogin}
                  disabled={isLoggingIn}
                  variant="outline"
                  className="rounded-full flex-1"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-success/20 rounded-2xl text-success">
            ✓ {language === 'zh' ? '分數已提交到龍虎榜！' : 'Score submitted to leaderboard!'}
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
