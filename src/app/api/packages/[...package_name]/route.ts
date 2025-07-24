import { decodePackageName } from "@/app/packages/[...package_name]/(utils)/decodePackageName";
import type { PackageVersion } from "@/types/package";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ package_name: string[] }> }) {
  try {
    const { package_name } = await params;
    const packageName = decodePackageName(package_name);

    if (!packageName || packageName.trim() === "") {
      return NextResponse.json({ error: "Package name is required" }, { status: 400 });
    }

    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: `Package "${packageName}" not found` }, { status: 404 });
      }

      throw new Error(`NPM API returned ${response.status}`);
    }

    const data: PackageVersion = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch package information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
