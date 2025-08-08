import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { http, NotFoundError } from "@/lib/http";
import type { PackageVersion } from "@/types/package";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PackageHeader } from "./PackageHeader";
import { PackageTabs } from "./PackageTabs";

type Props = {
  packageName: string;
};

export async function PackageDetail({ packageName }: Props) {
  const metadata = await getPackageJSON(packageName);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PackageHeader metadata={metadata} />
      <Suspense fallback={<GlobalLoadingFallback />}>
        <PackageTabs packageName={packageName} metadata={metadata} />
      </Suspense>
    </div>
  );
}

async function getPackageJSON(packageName: string): Promise<PackageVersion> {
  try {
    const response = await http(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}`
    );

    return response.json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}
