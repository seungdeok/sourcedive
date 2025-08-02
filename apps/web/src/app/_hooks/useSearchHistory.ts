import { safeLocalStorage } from "@/lib/browserStorage/LocalStorage";
import { useCallback } from "react";

export function useSearchHistory({
  storageKey = "search_history",
  maxItems = 5,
}: { storageKey?: string; maxItems?: number }) {
  const get = useCallback((): string[] => {
    return safeLocalStorage.getObject<string[]>(storageKey) || [];
  }, [storageKey]);

  const add = useCallback(
    (query: string) => {
      if (!query || !query.trim()) return;

      const trimmedQuery = query.trim();
      const currentHistory = safeLocalStorage.getObject<string[]>(storageKey) || [];
      const filteredHistory = currentHistory.filter(item => item !== trimmedQuery);
      const newHistory = [trimmedQuery, ...filteredHistory];
      const limitedHistory = newHistory.slice(0, maxItems);

      safeLocalStorage.setObject(storageKey, limitedHistory);
    },
    [storageKey, maxItems]
  );

  const remove = useCallback(
    (query: string) => {
      const currentHistory = safeLocalStorage.getObject<string[]>(storageKey) || [];
      const updatedHistory = currentHistory.filter(item => item !== query);
      safeLocalStorage.setObject(storageKey, updatedHistory);
    },
    [storageKey]
  );

  return {
    get,
    add,
    remove,
  };
}
