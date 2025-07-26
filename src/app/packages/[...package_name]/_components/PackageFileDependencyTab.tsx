import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  packageName: string;
};

export default function PackageFileDependencyTab({ packageName }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>파일 의존성 그래프</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 border rounded-lg flex items-center justify-center">(구현 예정)</div>
        </CardContent>
      </Card>
    </div>
  );
}
