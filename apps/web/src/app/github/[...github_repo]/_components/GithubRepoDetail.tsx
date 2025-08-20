import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { http, NotFoundError } from "@/lib/http";
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
  try {
    const response = await http(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/github/${encodeURIComponent(githubRepo)}`
    );

    http(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ranking/add`, {
      method: "POST",
      body: JSON.stringify({
        searchType: "github",
        searchTerm: githubRepo,
      }),
    });

    return response.json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}
