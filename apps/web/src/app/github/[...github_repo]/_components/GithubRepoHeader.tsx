import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GitHubRepo } from "@/types/github";
import { GithubIcon, Scale, User } from "lucide-react";
import Link from "next/link";

type Props = {
  metadata: GitHubRepo;
};

export function GithubRepoHeader({ metadata }: Props) {
  const name = metadata.full_name || "Unknown";
  const repositoryUrl = metadata.html_url || "Unknown";
  const owner = metadata.owner.login || "Unknown";
  const license = metadata.license?.spdx_id || "Unknown";

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={repositoryUrl} target="_blank">
              <Button variant="outline" size="sm">
                <GithubIcon className="w-4 h-4 mr-2" />
                Repository
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium" data-testid="github-repo-license">
                {license}
              </div>
              <div className="text-xs text-gray-500">License</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium" data-testid="github-repo-owner">
                {owner}
              </div>
              <div className="text-xs text-gray-500">Owner</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
