import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Download, ExternalLink, GithubIcon, Scale, User } from "lucide-react";
import Link from "next/link";
import type { PackageVersion } from "../../../../types/package";

type Props = {
  metadata: PackageVersion;
};

export function PackageHeader({ metadata }: Props) {
  const name = metadata.name || "Unknown Package";
  const author = getAuthor(metadata.author || metadata._npmUser);
  const repositoryUrl = getRepository(metadata.repository);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <Badge className="text-sm" variant="secondary">
                v{metadata.version}
              </Badge>
            </div>

            {metadata.description && <p className="text-lg text-gray-600 mb-4">{metadata.description}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={repositoryUrl?.replace("git+", "").replace(".git", "") || ""} target="_blank">
              <Button variant="outline" size="sm">
                <GithubIcon className="w-4 h-4 mr-2" />
                Repository
              </Button>
            </Link>
            <Link href={`https://www.npmjs.com/package/${metadata.name}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                NPM
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium">{metadata.license || "Unknown"}</div>
              <div className="text-xs text-gray-500">License</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium">{author}</div>
              <div className="text-xs text-gray-500">Author</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getAuthor(author?: string | { name: string; email?: string; url?: string }) {
  if (!author) return "Unknown";
  if (typeof author === "string") return author;
  return author.name;
}

function getRepository(repository?: string | { type: string; url: string; directory?: string }) {
  if (!repository) return null;
  if (typeof repository === "string") return repository;
  return repository.url;
}
