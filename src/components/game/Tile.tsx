import { cn } from '@/lib/utils';

interface TileProps {
  color: string;
  size: number;
  onClick: () => void;
  isSuccess?: boolean;
  isFail?: boolean;
  isClicked?: boolean;
  colorblindMode?: boolean;
  isVariant?: boolean;
  index: number;
}

export function Tile({
  color,
  size,
  onClick,
  isSuccess,
  isFail,
  isClicked,
  colorblindMode,
  isVariant,
  index,
}: TileProps) {
  return (
    <button
      onClick={onClick}
      disabled={isClicked && !isSuccess}
      className={cn(
        "tile relative overflow-hidden",
        isSuccess && "tile-success",
        isFail && "tile-fail",
        isClicked && !isSuccess && "opacity-70 cursor-not-allowed"
      )}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      aria-label={`Tile ${index + 1}`}
    >
      {/* Colorblind mode pattern */}
      {colorblindMode && isVariant && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-foreground/30" />
        </div>
      )}
      
      {/* Success indicator */}
      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-success/30 animate-scale-in">
          <span className="text-2xl">🦎</span>
        </div>
      )}
      
      {/* Fail indicator */}
      {isFail && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/30">
          <span className="text-xl">✕</span>
        </div>
      )}
    </button>
  );
}
