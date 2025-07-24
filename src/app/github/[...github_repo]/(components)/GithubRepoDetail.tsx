import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

type Props = {
  githubRepo: string;
};

export async function GithubRepoDetail({ githubRepo }: Props) {
  const metadata = await getGithubRepoJSON(githubRepo);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{githubRepo}</h1>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function getGithubRepoJSON(githubRepo: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/github/${encodeURIComponent(githubRepo)}`
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch github repository: ${response.status}`);
  }

  return response.json();
}
