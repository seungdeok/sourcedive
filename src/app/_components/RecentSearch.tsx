import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

export default function RecentSearch({
  recentSearches,
  onClickRecentSearch,
  onClickRemoveRecentSearch,
}: {
  recentSearches: string[];
  onClickRecentSearch: (key: string) => void;
  onClickRemoveRecentSearch: (key: string) => void;
}) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        최근 검색어
      </h3>

      <div className="flex flex-wrap gap-2">
        {recentSearches.map(key => (
          <div
            key={key}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold transition-colors py-2 pl-4 pr-2 cursor-pointer"
          >
            <Button
              variant="ghost"
              onClick={() => onClickRecentSearch(key)}
              className="p-0 h-auto hover:bg-transparentfont-semibold text-xs"
            >
              {key}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClickRemoveRecentSearch(key)}
              className="h-6 w-6 p-0 hover:bg-gray-300 ml-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
