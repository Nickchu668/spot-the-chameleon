import { useState, useCallback } from 'react';
import { Language } from '@/lib/i18n';

const LANG_KEY = 'chameleon-lang';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return (saved as Language) || 'zh';
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem(LANG_KEY, next);
      return next;
    });
  }, []);

  return { language, toggleLanguage };
}
