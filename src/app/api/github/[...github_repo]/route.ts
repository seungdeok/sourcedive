// import { decodePackageName } from "@/lib/decodePackageName";
import type { PackageVersion } from "@/types/package";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ github_repo: string[] }> }) {
  try {
    const { github_repo } = await params;

    if (!github_repo) {
      return NextResponse.json({ error: "Github repository name is required" }, { status: 400 });
    }

    const response = await fetch(`https://api.github.com/repos/${github_repo}`);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: `Github repository "${github_repo}" not found` }, { status: 404 });
      }

      throw new Error(`Github API returned ${response.status}`);
    }

    const data: PackageVersion = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to fetch github repository information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
