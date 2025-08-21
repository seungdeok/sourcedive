import type { GitHubRepo } from "@/types/github";
import { notFound } from "next/navigation";
import { http, NotFoundError } from "../http";
import { queries } from "./queryKeys";

type DependencyGraphResponse = {
  success: boolean;
  repository: string;
  entryFile: string;
  dependencies: Record<string, string[]>;
  stats: {
    totalFiles: number;
    totalDependencies: number;
  };
};

async function getGithubRepoDetail(githubRepo: string): Promise<GitHubRepo> {
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

export async function getDependenciesGraph(params: {
  entryFile: string;
  githubRepo: string;
}): Promise<DependencyGraphResponse> {
  const { entryFile, githubRepo } = params;

  const response = await http(
    `/api/github/dependency?entryFile=${entryFile}&githubRepo=https://github.com/${githubRepo}`
  );

  return response.json();
}

export const githubQueries = {
  all: () => queries.github.all,
  detail: (githubRepo: string) => ({
    queryKey: queries.github.detail(githubRepo).queryKey,
    queryFn: () => getGithubRepoDetail(githubRepo),
  }),
  dependency: (entryFile: string, githubRepo: string) => ({
    queryKey: queries.github.detail(githubRepo)._ctx.dependency(entryFile).queryKey,
    queryFn: () => getDependenciesGraph({ entryFile, githubRepo }),
  }),
};
