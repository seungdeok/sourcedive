import chalk from "chalk";
import { type DependencyTree, parseDependencyTree } from "dpdm";

export interface AnalyzeOptions {
  verbose: boolean;
  output?: string;
}

export interface AnalyzeResult {
  dependencies: Record<string, string[]>;
  duration: number;
}

export async function analyzeDependencies(entryFile: string, options: AnalyzeOptions): Promise<AnalyzeResult> {
  const startTime = Date.now();

  if (options.verbose) {
    console.log(chalk.gray(`🔍 Starting analysis in: ${entryFile}`));
  }

  try {
    const tree = await parseDependencyTree(entryFile, {
      context: process.cwd(),
    });

    const duration = Date.now() - startTime;

    return {
      dependencies: formatDependencyTree(tree),
      duration,
    };
  } catch (error) {
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : error}`);
  }
}

function formatDependencyTree(tree: DependencyTree): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [filePath, dependencies] of Object.entries(tree)) {
    if (dependencies === null) {
      result[filePath] = [];
    } else if (Array.isArray(dependencies)) {
      result[filePath] = dependencies.map(dep => dep.id);
    }
  }

  return result;
}
