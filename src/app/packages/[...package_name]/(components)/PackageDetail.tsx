import { notFound } from "next/navigation";
import type { PackageVersion } from "../../../../types/package";
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
      <PackageTabs packageName={packageName} metadata={metadata} />
    </div>
  );
}

async function getPackageJSON(packageName: string): Promise<PackageVersion> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}`
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch package: ${response.status}`);
  }

  return response.json();
}
