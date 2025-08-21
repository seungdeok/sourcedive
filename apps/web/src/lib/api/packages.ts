import type { GitHubItem } from "@/types/github";
import type { PackageSize, PackageVersion } from "@/types/package";
import { notFound } from "next/navigation";
import { http, ApiError, NotFoundError } from "../http";
import { queries } from "./queryKeys";

async function getPackageFile(packageName: string, path: string): Promise<GitHubItem[]> {
  try {
    const response = await http(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}/file?path=${encodeURIComponent(path)}`
    );

    return response.json();
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(`Failed to fetch package file: ${error}`);
  }
}

async function getPackageDependencySizes(packageName: string): Promise<PackageSize> {
  try {
    const response = await http(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}/size`
    );

    return response.json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}

async function getPackageDetail(packageName: string): Promise<PackageVersion> {
  try {
    const response = await http(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}`
    );

    http(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ranking/add`, {
      method: "POST",
      body: JSON.stringify({
        searchType: "package",
        searchTerm: packageName,
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

export const packageQueries = {
  all: () => queries.packages.all,
  detail: (packageName: string) => ({
    queryKey: queries.packages.detail(packageName).queryKey,
    queryFn: () => getPackageDetail(packageName),
  }),
  file: (packageName: string, path: string) => ({
    queryKey: queries.packages.detail(packageName)._ctx.file(path).queryKey,
    queryFn: () => getPackageFile(packageName, path),
  }),
  size: (packageName: string) => ({
    queryKey: queries.packages.detail(packageName)._ctx.size().queryKey,
    queryFn: () => getPackageDependencySizes(packageName),
  }),
};
