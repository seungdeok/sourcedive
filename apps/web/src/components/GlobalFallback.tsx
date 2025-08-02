"use client";

import { useEffect } from "react";

export default function GlobalFallback({
  error,
  reset,
}: {
  error: Error | null;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 className="text-lg font-medium text-red-900 mb-2">에러 발생</h2>
      <p className="text-red-700 mb-4">{error?.message}</p>
      <button type="button" onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}
