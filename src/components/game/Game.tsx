import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useGameState } from '@/hooks/useGameState';
import { t } from '@/lib/i18n';
import { StartMenu } from './StartMenu';
import { GameScreen } from './GameScreen';
import { LevelCompletePopup } from './LevelCompletePopup';
import { GameOverPopup } from './GameOverPopup';
import { VictoryScreen } from './VictoryScreen';
import { Leaderboard, LeaderboardEntry } from './Leaderboard';
import { Confetti } from './Confetti';
import { supabase } from '@/integrations/supabase/client';
import { formatTime } from './Timer';

export function Game() {
  const { language, toggleLanguage } = useLanguage();
  const {
    state,
    startGame,
    handleTileClick,
    nextLevel,
    restartLevel,
    restartGame,
    goToMenu,
    toggleSound,
  } = useGameState();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  // Fetch leaderboard data - sorted by level desc, time asc, mistakes asc
  const fetchLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true);
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('level', { ascending: false })
        .order('total_time_ms', { ascending: true })
        .order('mistakes', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setLeaderboardEntries(data || []);
      setTopThree((data || []).slice(0, 3));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  // Subscribe to realtime leaderboard updates
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  // Fetch leaderboard when showing
  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }, [showLeaderboard, fetchLeaderboard]);

  // Fetch top 3 on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Submit score (only for victory)
  const handleSubmitScore = async (name: string) => {
    const { error } = await supabase
      .from('leaderboard')
      .insert({
        name,
        total_time_ms: state.totalTimeMs,
        level: 10, // Completed all 10 levels
        mistakes: state.mistakes,
      });

    if (error) {
      console.error('Error submitting score:', error);
      throw error;
    }

    setSubmittedName(name);
    fetchLeaderboard();
  };

  // Share functionality
  const handleShare = async () => {
    const shareText = `${t('messages', 'iCompleted', language)} ${formatTime(state.totalTimeMs)} 🦎 #SpotTheChameleon`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('gameTitle', language),
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed, fall back to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    }
  };

  const handleOpenLeaderboard = () => {
    setShowLeaderboard(true);
    fetchLeaderboard();
  };

  // Render based on game status
  if (state.status === 'menu') {
    return (
      <>
        <StartMenu
          language={language}
          onToggleLanguage={toggleLanguage}
          onStart={startGame}
          onLeaderboard={handleOpenLeaderboard}
          bestTimeMs={state.bestTimeMs}
          topThree={topThree}
        />
        {showLeaderboard && (
          <Leaderboard
            entries={leaderboardEntries}
            language={language}
            onClose={() => setShowLeaderboard(false)}
            isLoading={isLoadingLeaderboard}
          />
        )}
      </>
    );
  }

  if (state.status === 'victory') {
    return (
      <>
        <VictoryScreen
          totalTimeMs={state.totalTimeMs}
          language={language}
          onSubmitScore={handleSubmitScore}
          onRestart={restartGame}
          onShare={handleShare}
        />
        {showLeaderboard && (
          <Leaderboard
            entries={leaderboardEntries}
            language={language}
            onClose={() => setShowLeaderboard(false)}
            isLoading={isLoadingLeaderboard}
            highlightName={submittedName || undefined}
          />
        )}
      </>
    );
  }

  return (
    <>
      {state.colorPair && (
        <GameScreen
          language={language}
          onToggleLanguage={toggleLanguage}
          currentLevel={state.currentLevel}
          totalTimeMs={state.totalTimeMs}
          bestTimeMs={state.bestTimeMs}
          mistakes={state.mistakes}
          soundEnabled={state.soundEnabled}
          onToggleSound={toggleSound}
          onRestart={restartGame}
          onMenu={goToMenu}
          colorPair={state.colorPair}
          variantIndex={state.variantIndex}
          onTileClick={handleTileClick}
          successTile={state.successTile}
          failTile={state.failTile}
          clickedTiles={state.clickedTiles}
        />
      )}

      {state.status === 'levelComplete' && (
        <>
          <Confetti active={true} />
          <LevelCompletePopup
            level={state.currentLevel}
            language={language}
            onNext={nextLevel}
          />
        </>
      )}

      {state.status === 'gameOver' && state.colorPair && (
        <GameOverPopup
          level={state.currentLevel}
          language={language}
          totalTimeMs={state.totalTimeMs}
          variantIndex={state.variantIndex}
          colorPair={state.colorPair}
          onMenu={goToMenu}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          entries={leaderboardEntries}
          language={language}
          onClose={() => setShowLeaderboard(false)}
          isLoading={isLoadingLeaderboard}
        />
      )}
    </>
  );
}
