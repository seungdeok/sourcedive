"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    adsbygoogle: any;
  }
}

interface GoogleAdsenseProps {
  adClient: string;
  adSlot: string;
  format?: string;
  responsive?: string;
  style?: React.CSSProperties;
}

const LOAD_AD_TIMEOUT = 2000;

export const GoogleAdsense = ({
  adClient,
  adSlot,
  format = "auto",
  responsive = "true",
  style = { display: "block", height: "280px" },
}: GoogleAdsenseProps) => {
  const adRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isAdLoaded) return;

    const loadAd = () => {
      if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
        window.adsbygoogle = (window.adsbygoogle || []).push({});
        setIsAdLoaded(true);
      }
    };

    const timer = setTimeout(loadAd, LOAD_AD_TIMEOUT);
    return () => clearTimeout(timer);
  }, [isMounted, isAdLoaded]);

  if (!isMounted) {
    return <div style={style} />;
  }

  return (
    <div style={{ ...style, minWidth: "320px" }}>
      <ins
        ref={adRef as React.RefObject<HTMLModElement>}
        className="adsbygoogle"
        style={{
          ...style,
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};
