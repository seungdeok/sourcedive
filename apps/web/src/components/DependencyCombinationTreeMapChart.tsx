"use client";

import { packageQueries } from "@/lib/api/packages";
import { useQuery } from "@tanstack/react-query";
import { GlobalLoadingFallback } from "./GlobalLoadingFallback";
import TreeMapChart from "./TreeMapChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DependencyCombinationTreeMapChart({ packageName }: { packageName: string }) {
  const { data, isLoading } = useQuery({
    ...packageQueries.size(packageName),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dependency 조합</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <GlobalLoadingFallback />}
        {!isLoading && !data && <div>데이터를 불러올 수 없습니다.</div>}
        {!isLoading && data && <TreeMapChart data={data.dependencySizes.map(d => [d.name, d.approximateSize])} />}
      </CardContent>
    </Card>
  );
}
