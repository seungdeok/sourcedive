"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useBrowserParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, [searchParams]);

  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const updated = new URLSearchParams(searchParams ?? undefined);

      for (const [key, value] of Object.entries(newParams)) {
        if (value === null || value === "") {
          updated.delete(key);
        } else {
          updated.set(key, value);
        }
      }

      const queryString = updated.toString();
      const path = pathname + (queryString ? `?${queryString}` : "");
      if (path !== pathname) router.push(path);
    },
    [router, searchParams, pathname]
  );

  const resetParams = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { params, updateParams, resetParams };
};
