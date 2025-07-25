"use client";

import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import TreeMapChart from "@/components/TreeMapChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PackageSize } from "@/types/package";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  packageName: string;
};

export default function PackageDependencyTab({ packageName }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <DependencyCombinationTreeMapChart packageName={packageName} />
      </div>
    </div>
  );
}

function DependencyCombinationTreeMapChart({ packageName }: { packageName: string }) {
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
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}/size`,
    { next: { revalidate: 3600 } }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch package: ${response.status}`);
  }

  return response.json();
}
