import { InternetServerError } from "@/lib/http";
import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const [packageResults, githubResults] = await Promise.all([
      redis.zrange("ranking:package", 0, limit - 1, { withScores: true, rev: true }),
      redis.zrange("ranking:github", 0, limit - 1, { withScores: true, rev: true }),
    ]);

    return NextResponse.json({
      success: true,
      rankings: {
        package: formatRankings(packageResults, "package"),
        github: formatRankings(githubResults, "github"),
      },
    });
  } catch (error: unknown) {
    if (error instanceof InternetServerError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

const formatRankings = (results: unknown[], type: string) => {
  const rankings = [];
  for (let i = 0; i < results.length; i += 2) {
    rankings.push({
      rank: Math.floor(i / 2) + 1,
      term: results[i] as string,
      score: results[i + 1],
      searchType: type,
    });
  }
  return rankings;
};
