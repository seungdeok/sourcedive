import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { decodePackageName } from "@/lib/decodePackageName";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GithubRepoDetail } from "./(components)/GithubRepoDetail";

type Props = {
  params: Promise<{ github_repo: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { github_repo } = await params;
  const githubRepo = decodePackageName(github_repo);

  return {
    title: `${githubRepo} - Repository 상세 정보`,
    description: `${githubRepo} Repository의 상세 정보를 확인하세요`,
  };
}

export default async function Page({ params }: Props) {
  const { github_repo } = await params;
  const githubRepo = decodePackageName(github_repo);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link href="/" className="hover:text-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
      </div>

      <GlobalErrorBoundary>
        <Suspense fallback={<GlobalLoadingFallback />}>
          <GithubRepoDetail githubRepo={githubRepo} />
        </Suspense>
      </GlobalErrorBoundary>
    </div>
  );
}
