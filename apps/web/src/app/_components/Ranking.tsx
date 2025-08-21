"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rankingQueries } from "@/lib/api/ranking";
import type { RankingItem } from "@/types/ranking";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Github, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

export function Ranking() {
  const { data } = useSuspenseQuery({
    ...rankingQueries.list(),
  });

  return (
    <section>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">인기 검색어</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mx-auto">
          <RankingList
            title={
              <>
                <Package className="h-5 w-5" />
                Package Rankings
              </>
            }
            rankings={data.rankings.package}
            type="package"
          />
          <RankingList
            title={
              <>
                <Github className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                GitHub Rankings
              </>
            }
            rankings={data.rankings.github}
            type="github"
          />
        </div>
      </div>
    </section>
  );
}

function RankingList({
  title,
  rankings,
  type,
}: { title: React.ReactNode; rankings: RankingItem[]; type: "package" | "github" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.length === 0 && (
            <div className="flex items-center justify-center p-4 rounded-lg border bg-card">
              <span className="text-sm text-muted-foreground">데이터가 없습니다.</span>
            </div>
          )}
          {rankings.map((item: RankingItem, index: number) => (
            <Link
              href={type === "package" ? `/packages/${item.term}` : `/github/${item.term}`}
              key={item.term}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="default"
                  className={`
                w-6 h-6 rounded-full flex items-center justify-center font-bold
              `}
                >
                  {item.rank}
                </Badge>
                <span className="font-medium text-sm text-foreground">{item.term}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
