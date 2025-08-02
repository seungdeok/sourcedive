import { type DependencyTree, parseDependencyTree } from "dpdm";
import { DependencyKind } from "dpdm/lib/consts";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { analyzeDependencies } from "../src/analyze";

vi.mock("dpdm", () => ({
  parseDependencyTree: vi.fn(),
}));

describe("CLI", () => {
  const mockParseDependencyTree = vi.mocked(parseDependencyTree);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("주어진_단일_엔트리_파일이_있을때_의존성을_분석하면_올바른_결과를_반환한다", async () => {
    // Given
    const entryFile = "./src/index.ts";
    const options = { verbose: false };
    const mockTree: DependencyTree = {
      "./src/index.ts": [
        { id: "./src/utils.ts", issuer: "", request: "", kind: DependencyKind.StaticExport },
        { id: "./src/types.ts", issuer: "", request: "", kind: DependencyKind.StaticExport },
      ],
      "./src/utils.ts": [{ id: "./src/helpers.ts", issuer: "", request: "", kind: DependencyKind.StaticExport }],
      "./src/types.ts": [],
      "./src/helpers.ts": [],
    };

    mockParseDependencyTree.mockResolvedValue(mockTree);

    // When
    const result = await analyzeDependencies(entryFile, options);

    // Then: 의존성 구조 반환
    expect(result.dependencies).toEqual({
      "./src/index.ts": ["./src/utils.ts", "./src/types.ts"],
      "./src/utils.ts": ["./src/helpers.ts"],
      "./src/types.ts": [],
      "./src/helpers.ts": [],
    });
    expect(mockParseDependencyTree).toHaveBeenCalledWith(entryFile, {
      context: process.cwd(),
    });
  });

  test("entryFile이_없을때_파싱_에러_발생한다.", async () => {
    // Given
    const entryFile = "./src/nonexistent.ts";
    const options = { verbose: false };
    const errorMessage = "File not found";
    mockParseDependencyTree.mockRejectedValue(new Error(errorMessage));

    // When & Then
    await expect(analyzeDependencies(entryFile, options)).rejects.toThrow(`Analysis failed: ${errorMessage}`);
  });
});
