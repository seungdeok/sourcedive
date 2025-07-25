import { parseGithubURL } from "@/lib/parseGithubURL";
import type { GitHubItem } from "@/types/github";
import type { PackageVersion } from "@/types/package";
import { type NextRequest, NextResponse } from "next/server";

async function fetchNpmPackageJson(packageName: string): Promise<PackageVersion> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) {
      throw new Error(`NPM package not found: ${packageName}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch NPM package info: ${error}`);
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
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents${pathString}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Repository or path not found" }, { status: 404 });
      }

      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data: GitHubItem[] | GitHubItem = await response.json();

    return NextResponse.json(Array.isArray(data) ? data : [data]);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
