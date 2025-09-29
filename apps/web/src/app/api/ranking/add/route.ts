import { InternetServerError } from "@/lib/http";
import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function POST(request: NextRequest) {
  try {
    const { searchType, searchTerm } = await request.json();

    if (!searchType || !searchTerm) {
      return NextResponse.json({ error: "searchType과 검색어는 필수 입니다." }, { status: 400 });
    }

    if (!["package", "github"].includes(searchType)) {
      return NextResponse.json({ error: "searchType은 package 또는 github여야 합니다." }, { status: 400 });
    }

    /**
     * 테스트 환경에서는 랭킹 추가를 하지 않습니다.
     */
    if (process.env.NODE_ENV === "development" || process.env.CI) {
      return NextResponse.json({ success: true, data: { searchTerm, newScore: 1, searchType } });
    }

    const key = `ranking:${searchType}`;

    const newScore = await redis.zincrby(key, 1, searchTerm);

    return NextResponse.json({ success: true, data: { searchTerm, newScore, searchType } });
  } catch (error: unknown) {
    if (error instanceof InternetServerError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
