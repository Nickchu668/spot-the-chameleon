import { Language, t } from '@/lib/i18n';
import { GameHeader } from './GameHeader';
import { GameGrid } from './GameGrid';
import { ColorPair } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';

interface GameScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  currentLevel: number;
  totalTimeMs: number;
  bestTimeMs: number | null;
  mistakes: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onMenu: () => void;
  colorPair: ColorPair;
  variantIndex: number;
  onTileClick: (index: number) => void;
  successTile: number | null;
  failTile: number | null;
  clickedTiles: Set<number>;
}

export function GameScreen({
  language,
  onToggleLanguage,
  currentLevel,
  totalTimeMs,
  bestTimeMs,
  mistakes,
  soundEnabled,
  onToggleSound,
  onRestart,
  onMenu,
  colorPair,
  variantIndex,
  onTileClick,
  successTile,
  failTile,
  clickedTiles,
}: GameScreenProps) {
  const levelTitle = t('levelTitles', currentLevel, language);

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      <GameHeader
        language={language}
        onToggleLanguage={onToggleLanguage}
        currentLevel={currentLevel}
        totalTimeMs={totalTimeMs}
        bestTimeMs={bestTimeMs}
        mistakes={mistakes}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onRestart={onRestart}
        onMenu={onMenu}
      />

      {/* Main game area */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-8 px-4">
        {/* Level title */}
        <div className="mb-6 text-center animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-black gradient-text mb-2">
            {levelTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('messages', 'findDifferent', language)}
          </p>
        </div>

        {/* Game grid */}
        <GameGrid
          level={currentLevel}
          colorPair={colorPair}
          variantIndex={variantIndex}
          onTileClick={onTileClick}
          successTile={successTile}
          failTile={failTile}
          clickedTiles={clickedTiles}
        />
      </main>
    </div>
  );
}
