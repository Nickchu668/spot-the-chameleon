import { LevelConfig } from './gameConfig';

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorPair {
  baseColor: string;
  variantColor: string;
  baseHSL: HSLColor;
  variantHSL: HSLColor;
}

export function randomHue(): number {
  return Math.floor(Math.random() * 360);
}

export function randomSaturation(): number {
  return 50 + Math.floor(Math.random() * 30); // 50-80%
}

export function randomLightness(): number {
  return 50 + Math.floor(Math.random() * 20); // 50-70%
}

export function hslToString(hsl: HSLColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function generateColorPair(levelConfig: LevelConfig): ColorPair {
  const baseHSL: HSLColor = {
    h: randomHue(),
    s: randomSaturation(),
    l: randomLightness(),
  };

  const variantHSL: HSLColor = {
    h: (baseHSL.h + levelConfig.hueDiff) % 360,
    s: Math.max(0, Math.min(100, baseHSL.s + levelConfig.satDiff)),
    l: Math.max(0, Math.min(100, baseHSL.l + levelConfig.lightDiff)),
  };

  return {
    baseColor: hslToString(baseHSL),
    variantColor: hslToString(variantHSL),
    baseHSL,
    variantHSL,
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

// Calculate approximate Delta E (simplified version)
export function calculateDeltaE(color1: HSLColor, color2: HSLColor): number {
  const rgb1 = hslToRgb(color1.h, color1.s, color1.l);
  const rgb2 = hslToRgb(color2.h, color2.s, color2.l);
  
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;
  
  // Simplified Delta E calculation
  return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB) / 100;
}

export function generateTileColors(
  levelConfig: LevelConfig,
  colorPair: ColorPair,
  variantIndex: number
): string[] {
  const totalTiles = levelConfig.gridCols * levelConfig.gridRows;
  const colors: string[] = [];
  
  for (let i = 0; i < totalTiles; i++) {
    colors.push(i === variantIndex ? colorPair.variantColor : colorPair.baseColor);
  }
  
  return colors;
}

export function getRandomVariantIndex(cols: number, rows: number): number {
  return Math.floor(Math.random() * (cols * rows));
}
