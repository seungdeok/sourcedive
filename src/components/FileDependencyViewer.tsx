"use client";

import { TreeFilesViewer } from "@/components/TreeFilesViewer";
import { Button } from "@/components/ui/button";
import { SUPPORTED_FILE_EXTENSIONS } from "@/configs/support";
import type { GitHubItem } from "@/types/github";
import { X } from "lucide-react";
import { useState } from "react";
import { FileDependencyGraphViewer } from "./FileDependencyGraphViewer";

export function FileDependencyViewer({ githubRepo, packageName }: { githubRepo: string; packageName: string }) {
  const [selectedFile, setSelectedFile] = useState<GitHubItem | null>(null);

  const handleSelectFile = (node: GitHubItem) => {
    if (SUPPORTED_FILE_EXTENSIONS.some(ext => node.name.endsWith(ext))) {
      setSelectedFile(node);
      return;
    }
    alert(`파일 의존성 분석은 ${SUPPORTED_FILE_EXTENSIONS.join(", ")} 파일만 지원합니다.`);
  };

  const handleClose = () => {
    setSelectedFile(null);
  };

  if (!selectedFile) {
    return <TreeFilesViewer packageName={packageName} onSelectFile={handleSelectFile} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Entry File</h3>
          <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClose} className="flex items-center gap-2">
          <X className="w-4 h-4" />
          취소
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <FileDependencyGraphViewer githubRepo={githubRepo} entryFile={selectedFile.download_url} />
          </div>
        </div>
      </div>
    </div>
  );
}
