import { useState, useCallback, useEffect, useRef } from 'react';
import { getLevelConfig, MAX_MISTAKES, TOTAL_LEVELS } from '@/lib/gameConfig';
import { generateColorPair, getRandomVariantIndex, ColorPair } from '@/lib/colorUtils';
import { playSuccessSound, playFailSound, playVictorySound } from '@/lib/audioUtils';

export type GameStatus = 'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory';

export interface GameState {
  status: GameStatus;
  currentLevel: number;
  mistakes: number;
  totalTimeMs: number;
  levelTimeMs: number;
  bestTimeMs: number | null;
  colorPair: ColorPair | null;
  variantIndex: number;
  clickedTiles: Set<number>;
  successTile: number | null;
  failTile: number | null;
  soundEnabled: boolean;
}

const BEST_TIME_KEY = 'chameleon-best-time';

export function useGameState() {
  const [state, setState] = useState<GameState>({
    status: 'menu',
    currentLevel: 1,
    mistakes: 0,
    totalTimeMs: 0,
    levelTimeMs: 0,
    bestTimeMs: null,
    colorPair: null,
    variantIndex: 0,
    clickedTiles: new Set(),
    successTile: null,
    failTile: null,
    soundEnabled: true,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const levelStartTimeRef = useRef<number>(0);

  // Load best time from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(BEST_TIME_KEY);
    if (saved) {
      setState(s => ({ ...s, bestTimeMs: parseInt(saved, 10) }));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.status === 'playing') {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setState(s => ({
          ...s,
          totalTimeMs: now - startTimeRef.current,
          levelTimeMs: now - levelStartTimeRef.current,
        }));
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.status]);

  const initializeLevel = useCallback((level: number, keepTime: boolean = false) => {
    const config = getLevelConfig(level);
    const colorPair = generateColorPair(config);
    const variantIndex = getRandomVariantIndex(config.gridCols, config.gridRows);

    if (!keepTime) {
      startTimeRef.current = Date.now();
    }
    levelStartTimeRef.current = Date.now();

    setState(s => ({
      ...s,
      currentLevel: level,
      mistakes: 0,
      colorPair,
      variantIndex,
      clickedTiles: new Set(),
      successTile: null,
      failTile: null,
      levelTimeMs: 0,
      ...(keepTime ? {} : { totalTimeMs: 0 }),
    }));
  }, []);

  const startGame = useCallback(() => {
    initializeLevel(1, false);
    setState(s => ({ ...s, status: 'playing' }));
  }, [initializeLevel]);

  const handleTileClick = useCallback((index: number) => {
    if (state.status !== 'playing') return;
    if (state.clickedTiles.has(index)) return;

    const isCorrect = index === state.variantIndex;

    if (isCorrect) {
      if (state.soundEnabled) playSuccessSound();
      
      setState(s => ({
        ...s,
        successTile: index,
        clickedTiles: new Set([...s.clickedTiles, index]),
      }));

      // Delay to show success animation
      setTimeout(() => {
        if (state.currentLevel >= TOTAL_LEVELS) {
          // Victory!
          const finalTime = Date.now() - startTimeRef.current;
          if (state.soundEnabled) playVictorySound();
          
          // Save best time
          const currentBest = state.bestTimeMs;
          if (!currentBest || finalTime < currentBest) {
            localStorage.setItem(BEST_TIME_KEY, finalTime.toString());
            setState(s => ({ ...s, bestTimeMs: finalTime }));
          }
          
          setState(s => ({ ...s, status: 'victory', totalTimeMs: finalTime }));
        } else {
          setState(s => ({ ...s, status: 'levelComplete' }));
        }
      }, 800);
    } else {
      if (state.soundEnabled) playFailSound();
      
      const newMistakes = state.mistakes + 1;
      
      setState(s => ({
        ...s,
        mistakes: newMistakes,
        failTile: index,
        clickedTiles: new Set([...s.clickedTiles, index]),
      }));

      // Clear fail animation
      setTimeout(() => {
        setState(s => ({ ...s, failTile: null }));
      }, 500);

      if (newMistakes >= MAX_MISTAKES) {
        setTimeout(() => {
          setState(s => ({ ...s, status: 'gameOver' }));
        }, 500);
      }
    }
  }, [state]);

  const nextLevel = useCallback(() => {
    initializeLevel(state.currentLevel + 1, true);
    setState(s => ({ ...s, status: 'playing' }));
  }, [state.currentLevel, initializeLevel]);

  const restartLevel = useCallback(() => {
    initializeLevel(state.currentLevel, true);
    setState(s => ({ ...s, status: 'playing' }));
  }, [state.currentLevel, initializeLevel]);

  const restartGame = useCallback(() => {
    initializeLevel(1, false);
    setState(s => ({ ...s, status: 'playing' }));
  }, [initializeLevel]);

  const goToMenu = useCallback(() => {
    setState(s => ({ ...s, status: 'menu' }));
  }, []);

  const toggleSound = useCallback(() => {
    setState(s => ({ ...s, soundEnabled: !s.soundEnabled }));
  }, []);

  return {
    state,
    startGame,
    handleTileClick,
    nextLevel,
    restartLevel,
    restartGame,
    goToMenu,
    toggleSound,
  };
}
