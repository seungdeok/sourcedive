"use client";

import type { PackageSize } from "@/types/package";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobalLoadingFallback } from "./GlobalLoadingFallback";
import TreeMapChart from "./TreeMapChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DependencyCombinationTreeMapChart({ packageName }: { packageName: string }) {
  const [sizes, setSizes] = useState<PackageSize | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPackageDependencySizes(packageName);
        setSizes(data);
      } catch (error) {
        console.error("Failed to fetch package sizes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [packageName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dependency 조합</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <GlobalLoadingFallback />}
        {!sizes && <div>데이터를 불러올 수 없습니다.</div>}
        {!loading && sizes && <TreeMapChart data={sizes.dependencySizes.map(d => [d.name, d.approximateSize])} />}
      </CardContent>
    </Card>
  );
}

async function getPackageDependencySizes(packageName: string): Promise<PackageSize> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}/size`
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch package: ${response.status}`);
  }

  return response.json();
}
