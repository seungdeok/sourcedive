import { exec } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { SUPPORTED_FILE_EXTENSIONS } from "@/configs/support";
import { type DependencyTree, parseDependencyTree } from "dpdm";
import { type NextRequest, NextResponse } from "next/server";

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryFile = searchParams.get("entryFile") || "";
    const githubRepo = searchParams.get("githubRepo") || "";

    if (!entryFile) {
      return NextResponse.json({ error: "Entry File is required" }, { status: 400 });
    }

    if (!githubRepo) {
      return NextResponse.json({ error: "GitHub Repo is required" }, { status: 400 });
    }

    if (!entryFile.includes("raw.githubusercontent.com")) {
      return NextResponse.json({ error: "Entry File is not a raw file" }, { status: 400 });
    }

    const response = await analyzeRepository(entryFile, githubRepo);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dependency analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze dependencies",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function analyzeRepository(entryFileUrl: string, githubRepo: string) {
  let tempRepoPath: string | null = null;
  const originalCwd: string | null = process.cwd();

  try {
    const repoMatch = githubRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!repoMatch) {
      throw new Error("Invalid GitHub repository URL format");
    }

    const [, owner, repo] = repoMatch;
    const urlParts = entryFileUrl.split("/");
    const branch = urlParts[5];
    const filePath = urlParts.slice(6).join("/");

    // 임시 디렉토리
    const tempDir = os.tmpdir();
    const repoId = `${owner}-${repo}-${branch}-${Date.now()}`;
    tempRepoPath = path.join(tempDir, "sourcedive", repoId);

    if (!fs.existsSync(path.dirname(tempRepoPath))) {
      fs.mkdirSync(path.dirname(tempRepoPath), { recursive: true });
    }

    // Git clone
    const cloneUrl = `https://github.com/${owner}/${repo}.git`;
    await execAsync(`git clone --depth 1 --branch ${branch} "${cloneUrl}" "${tempRepoPath}"`, { timeout: 30000 });

    const absoluteEntryPath = path.join(tempRepoPath, filePath);
    if (!fs.existsSync(absoluteEntryPath)) {
      throw new Error(`Entry file not found: ${filePath}`);
    }

    process.chdir(tempRepoPath);

    const tree = await parseDependencyTree(path.relative(tempRepoPath, absoluteEntryPath), {
      context: tempRepoPath,
      extensions: SUPPORTED_FILE_EXTENSIONS,
      exclude: /node_modules/,
    });

    const dependencies = formatDependencyTree(tree);

    return {
      success: true,
      repository: `${owner}/${repo}@${branch}`,
      entryFile: filePath,
      dependencies,
      stats: {
        totalFiles: Object.keys(dependencies).length,
        totalDependencies: Object.values(dependencies).flat().length,
      },
    };
  } finally {
    // cleanup
    try {
      if (fs.existsSync(originalCwd)) {
        process.chdir(originalCwd);
        console.log("Working directory restored");
      }
    } catch (error) {
      console.warn("Failed to restore working directory:", error);
      try {
        process.chdir(os.homedir());
      } catch (fallbackError) {
        process.chdir("/");
      }
    }

    if (tempRepoPath && fs.existsSync(tempRepoPath)) {
      try {
        await execAsync(`rm -rf "${tempRepoPath}"`);
      } catch (cleanupError) {
        console.warn("Failed to cleanup temp repository:", cleanupError);
      }
    }
  }
}

function formatDependencyTree(tree: DependencyTree): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [filePath, dependencies] of Object.entries(tree)) {
    if (dependencies === null) {
      result[filePath] = [];
    } else if (Array.isArray(dependencies)) {
      result[filePath] = dependencies.map(dep => dep.id).filter((id, index, self) => id && self.indexOf(id) === index);
    }
  }

  return result;
}
