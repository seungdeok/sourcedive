import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import type { GitHubRepo } from "@/types/github";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GithubRepoHeader } from "./GithubRepoHeader";
import { GithubRepoTabs } from "./GithubRepoTabs";

type Props = {
  githubRepo: string;
};

export async function GithubRepoDetail({ githubRepo }: Props) {
  const metadata = await getGithubRepoJSON(githubRepo);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <GithubRepoHeader metadata={metadata} />
      <Suspense fallback={<GlobalLoadingFallback />}>
        <GithubRepoTabs githubRepo={githubRepo} metadata={metadata} />
      </Suspense>
    </div>
  );
}

async function getGithubRepoJSON(githubRepo: string): Promise<GitHubRepo> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/github/${encodeURIComponent(githubRepo)}`
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch github repository: ${response.status}`);
  }

  return response.json();
}
