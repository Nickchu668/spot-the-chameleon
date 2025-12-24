export type Language = 'zh' | 'en';

export const translations = {
  // Game title
  gameTitle: {
    zh: '變色龍找不同',
    en: 'Spot the Chameleon'
  },
  
  // Level titles
  levelTitles: {
    1: { zh: '彩虹新手', en: 'Rainbow Rookie' },
    2: { zh: '色調獵人', en: 'Hue Hunter' },
    3: { zh: '陰影高手', en: 'Shadow Spotter' },
    4: { zh: '偽裝破壞者', en: 'Camo Crusher' },
    5: { zh: '光譜獵鷹', en: 'Spectrum Hawk' },
    6: { zh: '色差忍者', en: 'Delta Ninja' },
    7: { zh: '微光覓者', en: 'Microtone Seeker' },
    8: { zh: '極限色魔', en: 'Chroma Sorcerer' },
    9: { zh: '變色龍王', en: 'Chameleon Sovereign' },
    10: { zh: '絕對色神', en: 'Absolute Chroma God' },
  },
  
  // UI elements
  ui: {
    start: { zh: '開始遊戲', en: 'Start Game' },
    restart: { zh: '重新開始', en: 'Restart' },
    menu: { zh: '選單', en: 'Menu' },
    nextLevel: { zh: '下一關', en: 'Next Level' },
    level: { zh: '關卡', en: 'Level' },
    time: { zh: '時間', en: 'Time' },
    bestTime: { zh: '最佳時間', en: 'Best Time' },
    mistakes: { zh: '錯誤', en: 'Mistakes' },
    leaderboard: { zh: '排行榜', en: 'Leaderboard' },
    submit: { zh: '提交', en: 'Submit' },
    close: { zh: '關閉', en: 'Close' },
    share: { zh: '分享', en: 'Share' },
    download: { zh: '下載', en: 'Download' },
    sound: { zh: '音效', en: 'Sound' },
    soundOn: { zh: '開', en: 'On' },
    soundOff: { zh: '關', en: 'Off' },
    rank: { zh: '排名', en: 'Rank' },
    name: { zh: '名稱', en: 'Name' },
    date: { zh: '日期', en: 'Date' },
    practice: { zh: '練習模式', en: 'Practice Mode' },
    daily: { zh: '每日挑戰', en: 'Daily Challenge' },
    colorblind: { zh: '色盲模式', en: 'Colorblind Mode' },
  },
  
  // Messages
  messages: {
    findDifferent: { zh: '找出不同的顏色！', en: 'Find the different color!' },
    levelComplete: { zh: '過關！', en: 'Level Complete!' },
    wrongTile: { zh: '錯了！再試一次', en: 'Wrong! Try again' },
    gameOver: { zh: '遊戲結束', en: 'Game Over' },
    tryAgain: { zh: '再試一次', en: 'Try Again' },
    congratulations: { zh: '恭喜通關10關！', en: 'Congrats on 10 Levels!' },
    enterName: { zh: '輸入暱稱上榜', en: 'Enter Name for Leaderboard' },
    mysteryPlayer: { zh: '神秘玩家', en: 'Mystery Player' },
    challengeMe: { zh: '挑戰我！🦎', en: 'Challenge Me! 🦎' },
    iCompleted: { zh: '我通關變色龍找不同！', en: 'I completed Spot the Chameleon!' },
    noMistakes: { zh: '沒有錯誤機會了！', en: 'No mistakes left!' },
    autoNextIn: { zh: '秒後自動進入下一關', en: 's to next level' },
    correctAnswer: { zh: '正確答案在這裡', en: 'Correct answer is here' },
    gameOverScore: { zh: '你的成績', en: 'Your Score' },
    submitToLeaderboard: { zh: '提交到龍虎榜', en: 'Submit to Leaderboard' },
    loginToSubmit: { zh: '登入以提交成績', en: 'Login to submit score' },
    orLoginWith: { zh: '或使用以下方式登入', en: 'Or login with' },
  },
  
  // Rank titles based on level reached
  rankTitles: {
    1: { zh: '色彩初心者', en: 'Color Novice' },
    2: { zh: '辨色學徒', en: 'Color Apprentice' },
    3: { zh: '色感見習生', en: 'Color Trainee' },
    4: { zh: '彩虹追尋者', en: 'Rainbow Seeker' },
    5: { zh: '光譜守護者', en: 'Spectrum Guardian' },
    6: { zh: '色差探索家', en: 'Delta Explorer' },
    7: { zh: '微調達人', en: 'Microtone Master' },
    8: { zh: '色彩行者', en: 'Chroma Walker' },
    9: { zh: '變色龍使者', en: 'Chameleon Messenger' },
    10: { zh: '絕對色神', en: 'Absolute Chroma God' },
  },
  
  // Victory
  victory: {
    title: { zh: '變色龍帝國之王', en: 'Chameleon Empire Lord' },
    subtitle: { zh: '你是色彩大師！', en: 'You are the Color Master!' },
  },
  
  // Rules
  rules: {
    title: { zh: '遊戲規則', en: 'How to Play' },
    rule1: { zh: '在每一關中，找出顏色不同的方塊', en: 'Find the tile with a different color in each level' },
    rule2: { zh: '點擊正確方塊進入下一關', en: 'Click the correct tile to advance' },
    rule3: { zh: '每關最多可犯3次錯誤', en: 'Maximum 3 mistakes per level' },
    rule4: { zh: '完成10關後可上傳分數', en: 'Complete all 10 levels to submit your score' },
  },
} as const;

export function t(key: keyof typeof translations, lang: Language): string;
export function t(section: 'levelTitles' | 'rankTitles', level: number, lang: Language): string;
export function t(section: 'ui' | 'messages' | 'victory' | 'rules', key: string, lang: Language): string;
export function t(...args: any[]): string {
  if (args.length === 2) {
    const [key, lang] = args as [keyof typeof translations, Language];
    const value = translations[key];
    if (typeof value === 'object' && 'zh' in value && 'en' in value) {
      return value[lang];
    }
    return '';
  }
  
  const [section, keyOrLevel, lang] = args;
  
  if (section === 'levelTitles' || section === 'rankTitles') {
    const level = keyOrLevel as number;
    const titles = translations[section][level as keyof typeof translations.levelTitles];
    return titles ? titles[lang as Language] : '';
  }
  
  const sectionObj = translations[section as keyof typeof translations];
  if (typeof sectionObj === 'object') {
    const item = (sectionObj as any)[keyOrLevel];
    if (item && typeof item === 'object' && lang in item) {
      return item[lang as Language];
    }
  }
  
  return '';
}
