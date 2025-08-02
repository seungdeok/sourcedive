import { FileDependencyViewer } from "@/components/FileDependencyViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  githubRepo: string;
  packageName: string;
};

export default function GithubRepoFileDependencyTab({ githubRepo, packageName }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>파일 의존성 그래프</CardTitle>
        </CardHeader>
        <CardContent>
          <FileDependencyViewer githubRepo={githubRepo} packageName={packageName} />
        </CardContent>
      </Card>
    </div>
  );
}
