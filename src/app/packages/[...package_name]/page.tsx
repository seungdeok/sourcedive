import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { decodePackageName } from "@/lib/decodePackageName";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PackageDetail } from "./_components/PackageDetail";

type Props = {
  params: Promise<{ package_name: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { package_name } = await params;
  const packageName = decodePackageName(package_name);

  return {
    title: `${packageName} - 패키지 상세 정보`,
    description: `${packageName} 패키지의 상세 정보를 확인하세요`,
  };
}

export default async function Page({ params }: Props) {
  const { package_name } = await params;
  const packageName = decodePackageName(package_name);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link href="/" className="hover:text-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
      </div>

      <GlobalErrorBoundary>
        <Suspense fallback={<GlobalLoadingFallback />}>
          <PackageDetail packageName={packageName} />
        </Suspense>
      </GlobalErrorBoundary>
    </div>
  );
}
