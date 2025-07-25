"use client";

import { DependencyCombinationTreeMapChart } from "@/components/DependencyCombinationTreeMapChart";

type Props = {
  packageName: string;
};

export default function GithubRepoDependencyTab({ packageName }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <DependencyCombinationTreeMapChart packageName={packageName} />
      </div>
    </div>
  );
}
