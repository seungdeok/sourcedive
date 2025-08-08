import { http, InternetServerError, NotFoundError } from "@/lib/http";
import { parseGithubURL } from "@/lib/parseGithubURL";
import type { GitHubItem } from "@/types/github";
import type { PackageVersion } from "@/types/package";
import { type NextRequest, NextResponse } from "next/server";

async function fetchNpmPackageJson(packageName: string): Promise<PackageVersion> {
  try {
    const response = await http(`https://registry.npmjs.org/${packageName}`);
    return response.json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(`NPM package not found: ${packageName}`);
    }

    throw new InternetServerError(`Failed to fetch NPM package info: ${error}`);
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ package_name: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const { package_name } = await params;
    const packageName = decodeURIComponent(package_name);
    const path = searchParams.get("path") || "";

    if (!packageName || packageName.trim() === "") {
      return NextResponse.json({ error: "Package name is required" }, { status: 400 });
    }

    const pacakgeJson = await fetchNpmPackageJson(packageName);

    let ownerRepo = null;
    // repository
    if (pacakgeJson.repository) {
      ownerRepo = parseGithubURL(
        typeof pacakgeJson.repository === "string" ? pacakgeJson.repository : pacakgeJson.repository.url
      );
    }

    // homepage
    if (!ownerRepo && pacakgeJson.homepage) {
      ownerRepo = parseGithubURL(pacakgeJson.homepage);
    }

    // bugs
    if (!ownerRepo && pacakgeJson.bugs) {
      ownerRepo = parseGithubURL(typeof pacakgeJson.bugs === "string" ? pacakgeJson.bugs : pacakgeJson.bugs.url);
    }

    if (!ownerRepo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    const { owner, repo } = ownerRepo;
    const pathString = path ? `/${path}` : "";
    const response = await http(`https://api.github.com/repos/${owner}/${repo}/contents${pathString}`, {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    const data: GitHubItem[] | GitHubItem = await response.json();

    return NextResponse.json(Array.isArray(data) ? data : [data]);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Repository or path not found" }, { status: 404 });
    }

    if (error instanceof InternetServerError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
