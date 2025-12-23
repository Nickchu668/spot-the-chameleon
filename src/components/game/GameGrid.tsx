import { useMemo } from 'react';
import { Tile } from './Tile';
import { getLevelConfig } from '@/lib/gameConfig';
import { generateTileColors, ColorPair } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';

interface GameGridProps {
  level: number;
  colorPair: ColorPair;
  variantIndex: number;
  onTileClick: (index: number) => void;
  successTile: number | null;
  failTile: number | null;
  clickedTiles: Set<number>;
  colorblindMode?: boolean;
}

export function GameGrid({
  level,
  colorPair,
  variantIndex,
  onTileClick,
  successTile,
  failTile,
  clickedTiles,
  colorblindMode = false,
}: GameGridProps) {
  const config = getLevelConfig(level);
  
  const tileColors = useMemo(() => {
    return generateTileColors(config, colorPair, variantIndex);
  }, [config, colorPair, variantIndex]);

  // Calculate responsive tile size
  const responsiveTileSize = useMemo(() => {
    if (typeof window === 'undefined') return config.tileSize;
    
    const maxWidth = Math.min(window.innerWidth - 32, 600);
    const gap = 8;
    const totalGaps = (config.gridCols - 1) * gap;
    const availableWidth = maxWidth - totalGaps;
    const calculatedSize = Math.floor(availableWidth / config.gridCols);
    
    return Math.min(calculatedSize, config.tileSize);
  }, [config]);

  return (
    <div 
      className={cn(
        "grid gap-2 p-4 rounded-3xl",
        "bg-card/30 backdrop-blur-sm",
        "animate-scale-in"
      )}
      style={{
        gridTemplateColumns: `repeat(${config.gridCols}, ${responsiveTileSize}px)`,
        gridTemplateRows: `repeat(${config.gridRows}, ${responsiveTileSize}px)`,
      }}
    >
      {tileColors.map((color, index) => (
        <Tile
          key={index}
          index={index}
          color={color}
          size={responsiveTileSize}
          onClick={() => onTileClick(index)}
          isSuccess={successTile === index}
          isFail={failTile === index}
          isClicked={clickedTiles.has(index)}
          colorblindMode={colorblindMode}
          isVariant={index === variantIndex}
        />
      ))}
    </div>
  );
}
