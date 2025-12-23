import { Language, t } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { formatTime } from './Timer';
import { Trophy, X, Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LeaderboardEntry {
  id: string;
  name: string;
  total_time_ms: number;
  completed_at: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  language: Language;
  onClose: () => void;
  isLoading?: boolean;
  highlightName?: string;
}

export function Leaderboard({
  entries,
  language,
  onClose,
  isLoading,
  highlightName,
}: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">{rank}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className={cn(
        "glass-card rounded-3xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col",
        "animate-scale-in"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" />
            {t('ui', 'leaderboard', language)}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 -mx-2 px-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {language === 'zh' ? '還沒有紀錄' : 'No records yet'}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="py-3 px-2">{t('ui', 'rank', language)}</th>
                  <th className="py-3 px-2">{t('ui', 'name', language)}</th>
                  <th className="py-3 px-2 text-right">{t('ui', 'time', language)}</th>
                  <th className="py-3 px-2 text-right hidden sm:table-cell">{t('ui', 'date', language)}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={cn(
                      "border-b border-border/50 transition-colors",
                      highlightName === entry.name && "bg-primary/10"
                    )}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(index + 1)}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={cn(
                        "font-semibold",
                        index === 0 && "text-yellow-400",
                        index === 1 && "text-gray-300",
                        index === 2 && "text-amber-600"
                      )}>
                        {entry.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      {formatTime(entry.total_time_ms)}
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-muted-foreground hidden sm:table-cell">
                      {formatDate(entry.completed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
