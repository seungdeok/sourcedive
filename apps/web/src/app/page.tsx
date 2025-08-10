import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import type { Metadata } from "next";
import { Suspense } from "react";
import { FAQ } from "./_components/FAQ";
import { MainTabs } from "./_components/MainTabs";

export const metadata: Metadata = {
  title: "패키지 조회",
  description: "패키지를 조회 혹은 업로드하여 상세 정보를 확인하세요",
};

export default function Page() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Source Dive</h1>
        <p className="text-gray-600">패키지를 검색하거나 파일을 업로드하여 상세 정보를 확인하세요</p>
      </div>

      <GlobalErrorBoundary>
        <Suspense fallback={<GlobalLoadingFallback />}>
          <MainTabs />
        </Suspense>
      </GlobalErrorBoundary>

      <div className="mt-16">
        <FAQ />
      </div>
    </div>
  );
}
