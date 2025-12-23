export interface LevelConfig {
  level: number;
  gridCols: number;
  gridRows: number;
  tileSize: number;
  hueDiff: number;
  satDiff: number;
  lightDiff: number;
  approxDeltaE: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, gridCols: 3, gridRows: 3, tileSize: 120, hueDiff: 30, satDiff: 10, lightDiff: 0, approxDeltaE: '>3' },
  { level: 2, gridCols: 3, gridRows: 3, tileSize: 100, hueDiff: 20, satDiff: 0, lightDiff: 0, approxDeltaE: '2-3' },
  { level: 3, gridCols: 4, gridRows: 4, tileSize: 90, hueDiff: 15, satDiff: 0, lightDiff: -5, approxDeltaE: '2' },
  { level: 4, gridCols: 4, gridRows: 4, tileSize: 80, hueDiff: 10, satDiff: 0, lightDiff: 0, approxDeltaE: '1.5-2' },
  { level: 5, gridCols: 5, gridRows: 5, tileSize: 70, hueDiff: 8, satDiff: -3, lightDiff: 0, approxDeltaE: '1.2-1.5' },
  { level: 6, gridCols: 5, gridRows: 5, tileSize: 65, hueDiff: 5, satDiff: 0, lightDiff: 0, approxDeltaE: '1-1.2' },
  { level: 7, gridCols: 5, gridRows: 6, tileSize: 55, hueDiff: 3, satDiff: 0, lightDiff: -2, approxDeltaE: '0.8-1' },
  { level: 8, gridCols: 5, gridRows: 6, tileSize: 50, hueDiff: 2, satDiff: 0, lightDiff: 0, approxDeltaE: '0.6-0.8' },
  { level: 9, gridCols: 6, gridRows: 6, tileSize: 48, hueDiff: 1.5, satDiff: -1, lightDiff: 0, approxDeltaE: '0.5-0.6' },
  { level: 10, gridCols: 6, gridRows: 6, tileSize: 45, hueDiff: 1, satDiff: 0.5, lightDiff: 0.5, approxDeltaE: '<0.5' },
];

export const MAX_MISTAKES = 3;
export const TOTAL_LEVELS = 10;

export const FALLBACK_COLOR_PAIRS = [
  { base: '#C8C8C8', variant: '#C0C8C8' },
  { base: '#646464', variant: '#646364' },
  { base: '#0096C8', variant: '#0095C8' },
  { base: '#FFC8C8', variant: '#FFC7C8' },
  { base: '#d97b49', variant: '#d87b49' },
  { base: '#bac555', variant: '#b9c456' },
  { base: '#917fc9', variant: '#997fc9' },
  { base: '#b442b5', variant: '#a947aa' },
  { base: '#51de74', variant: '#51de8d' },
  { base: '#4370b1', variant: '#2567c7' },
];

export function getLevelConfig(level: number): LevelConfig {
  return LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
}
