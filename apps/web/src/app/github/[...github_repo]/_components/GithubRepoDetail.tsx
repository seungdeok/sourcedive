"use client";

import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { githubQueries } from "@/lib/api/github";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { GithubRepoHeader } from "./GithubRepoHeader";
import { GithubRepoTabs } from "./GithubRepoTabs";

type Props = {
  githubRepo: string;
};

export function GithubRepoDetail({ githubRepo }: Props) {
  const { data } = useSuspenseQuery({
    ...githubQueries.detail(githubRepo),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <GithubRepoHeader metadata={data} />
      <Suspense fallback={<GlobalLoadingFallback />}>
        <GithubRepoTabs githubRepo={githubRepo} metadata={data} />
      </Suspense>
    </div>
  );
}
