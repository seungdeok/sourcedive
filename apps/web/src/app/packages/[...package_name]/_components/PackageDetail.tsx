"use client";

import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { packageQueries } from "@/lib/api/packages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { PackageHeader } from "./PackageHeader";
import { PackageTabs } from "./PackageTabs";

type Props = {
  packageName: string;
};

export function PackageDetail({ packageName }: Props) {
  const { data } = useSuspenseQuery({
    ...packageQueries.detail(packageName),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PackageHeader metadata={data} />
      <Suspense fallback={<GlobalLoadingFallback />}>
        <PackageTabs packageName={packageName} metadata={data} />
      </Suspense>
    </div>
  );
}
