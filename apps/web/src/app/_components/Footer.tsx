"use client";

import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import dynamic from "next/dynamic";

const GoogleAdsense = dynamic(() => import("@/components/GoogleAdsense").then(mod => mod.GoogleAdsense), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[280px] flex items-center justify-center">
      <GlobalLoadingFallback />
    </div>
  ),
});

export function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 mx-auto py-8 px-4 w-full flex flex-col items-center gap-2">
      {process.env.NODE_ENV === "production" && (
        <GoogleAdsense
          adClient={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
          adSlot={process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOT || ""}
        />
      )}
      <p>Copyright 2025 seungdeok.</p>
      <p>All rights reserved.</p>
    </footer>
  );
}
