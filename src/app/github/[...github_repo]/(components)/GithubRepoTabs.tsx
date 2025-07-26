"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrowserParams } from "@/hooks/useBrowserParams";
import type { GitHubRepo } from "@/types/github";
import { Suspense } from "react";
import GithubRepoDependencyTab from "./GithubRepoDependencyTab";
import GithubRepoFileDependencyTab from "./GithubRepoFileDependencyTab";
import GithubRepoFileTab from "./GithubRepoFileTab";

type Props = {
  githubRepo: string;
  metadata: GitHubRepo;
};

export function GithubRepoTabs({ githubRepo, metadata }: Props) {
  const { params, updateParams } = useBrowserParams();

  const value = params.tab ?? "";

  const handleTabChange = (value: string) => {
    updateParams({ tab: value });
  };

  return (
    <Tabs value={value} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        <TabsTrigger value="file-dependencies">File Dependencies</TabsTrigger>
      </TabsList>

      <TabsContent value="files" className="mt-6">
        <Suspense fallback={<LoadingFallback />}>
          <GithubRepoFileTab packageName={metadata.name} />
        </Suspense>
      </TabsContent>

      <TabsContent value="dependencies" className="mt-6">
        <Suspense fallback={<LoadingFallback />}>
          <GithubRepoDependencyTab packageName={metadata.name} />
        </Suspense>
      </TabsContent>

      <TabsContent value="file-dependencies" className="mt-6">
        <Suspense fallback={<LoadingFallback />}>
          <GithubRepoFileDependencyTab packageName={metadata.name} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
