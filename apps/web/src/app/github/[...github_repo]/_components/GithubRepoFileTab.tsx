import { TreeFilesViewer } from "@/components/TreeFilesViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  packageName: string;
};

export default function GithubRepoFileTab({ packageName }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            파일 뷰어
            <span className="text-sm font-normal text-gray-500">({packageName})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TreeFilesViewer packageName={packageName} />
        </CardContent>
      </Card>
    </div>
  );
}
