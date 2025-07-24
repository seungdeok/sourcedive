"use client";

import { useEffect } from "react";
import GlobalFallback from "@/components/GlobalFallback";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <GlobalFallback error={error} reset={reset} />;
}
