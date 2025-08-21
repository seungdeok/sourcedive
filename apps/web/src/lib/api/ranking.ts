import type { RankingItem } from "@/types/ranking";
import { http } from "../http";
import { queries } from "./queryKeys";

type RankingResponse = {
  success: boolean;
  rankings: {
    package: RankingItem[];
    github: RankingItem[];
  };
};

async function getRanking(limit = 5): Promise<RankingResponse> {
  try {
    const response = await http(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ranking/search?limit=${limit}`
    );

    return response.json();
  } catch (error: unknown) {
    console.warn("Ranking API failed:", error);
    throw error;
  }
}

export const rankingQueries = {
  all: () => queries.ranking.all,
  list: (limit = 5) => ({
    queryKey: queries.ranking.list(limit).queryKey,
    queryFn: () => getRanking(limit),
  }),
};
