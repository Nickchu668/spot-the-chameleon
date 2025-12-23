import { Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({ language, onToggle, className }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full",
        "bg-muted/50 hover:bg-muted transition-all duration-200",
        "text-sm font-semibold",
        className
      )}
      aria-label={language === 'zh' ? 'Switch to English' : '切換到中文'}
    >
      <span className={cn(
        "transition-opacity",
        language === 'zh' ? 'opacity-100' : 'opacity-50'
      )}>
        🇹🇼
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={cn(
        "transition-opacity",
        language === 'en' ? 'opacity-100' : 'opacity-50'
      )}>
        🇺🇸
      </span>
    </button>
  );
}
