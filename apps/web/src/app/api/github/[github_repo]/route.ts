// import { decodePackageName } from "@/lib/decodePackageName";
import { http, InternetServerError, NotFoundError } from "@/lib/http";
import type { PackageVersion } from "@/types/package";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ github_repo: string }> }) {
  try {
    const { github_repo } = await params;
    const githubRepo = decodeURIComponent(github_repo);

    if (!githubRepo) {
      return NextResponse.json({ error: "Github repository name is required" }, { status: 400 });
    }

    const response = await http(`https://api.github.com/repos/${githubRepo}`, {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    const data: PackageVersion = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Github repository not found" }, { status: 404 });
    }

    if (error instanceof InternetServerError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
