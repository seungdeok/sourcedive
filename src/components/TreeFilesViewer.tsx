import type { GitHubItem } from "@/types/github";
import { AlertCircle, ChevronDown, ChevronRight, ExternalLink, File, Folder, FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type TreeNodeData = {
  node: GitHubItem;
  isExpanded: boolean;
  isDirectory: boolean;
  children: TreeNodeData[];
  isLoading: boolean;
};

export function TreeFilesViewer({ packageName }: { packageName: string }) {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDirectory = useCallback(
    async (path = "") => {
      try {
        const data = await getPackageFile(packageName, path);

        if (path === "") {
          const rootNodes: TreeNodeData[] = data.map(node => ({
            node,
            isExpanded: false,
            isLoading: false,
            isDirectory: node.type === "dir",
            children: [],
          }));
          setTreeData(rootNodes);
          setLoading(false);

          return;
        }

        updateTree(path, data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    },
    [packageName]
  );

  const updateTree = (targetPath: string, newItems: GitHubItem[]) => {
    const updateNode = (nodes: TreeNodeData[]): TreeNodeData[] => {
      return nodes.map(node => {
        if (node.node.path === targetPath) {
          return {
            ...node,
            children: newItems.map(node => ({
              node,
              isExpanded: false,
              isLoading: false,
              isDirectory: node.type === "dir",
              children: [],
            })),
            isLoading: false,
          };
        }

        if (node.children.length > 0) {
          return {
            ...node,
            children: updateNode(node.children),
          };
        }

        return node;
      });
    };

    setTreeData(prev => updateNode(prev));
  };

  const handleToggle = async (node: TreeNodeData) => {
    if (!node.isDirectory) return;

    const setNodeLoading = (nodes: TreeNodeData[], targetPath: string, loading: boolean): TreeNodeData[] => {
      return nodes.map(n => {
        if (n.node.path === targetPath) {
          return { ...n, isLoading: loading };
        }
        if (n.children) {
          return { ...n, children: setNodeLoading(n.children, targetPath, loading) };
        }
        return n;
      });
    };

    if (!node.isExpanded) {
      if (!node.isLoading && node.children.length === 0) {
        setTreeData(prev => setNodeLoading(prev, node.node.path, true));
        await loadDirectory(node.node.path);
      }

      setTreeData(prev => prev.map(n => updateNodeExpansion(n, node.node.path, true)));
    } else {
      setTreeData(prev => prev.map(n => updateNodeExpansion(n, node.node.path, false)));
    }
  };

  const updateNodeExpansion = (node: TreeNodeData, targetPath: string, expanded: boolean): TreeNodeData => {
    if (node.node.path === targetPath) {
      return { ...node, isExpanded: expanded };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeExpansion(child, targetPath, expanded)),
      };
    }

    return node;
  };

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  return (
    <div className="border rounded-lg">
      {loading ? (
        <LoadingFallback />
      ) : error ? (
        <Fallback error={error} />
      ) : (
        <div className="max-h-96 overflow-auto">
          {treeData.length > 0 ? (
            treeData.map(node => <TreeNode key={node.node.path} node={node} level={0} onToggle={handleToggle} />)
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Folder className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No files found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TreeNode: React.FC<{
  node: TreeNodeData;
  level: number;
  onToggle: (node: TreeNodeData) => void;
}> = ({ node, level, onToggle }) => {
  const isDirectory = node.isDirectory;
  const hasChildren = node.children.length > 0;
  const canExpand = isDirectory && (!node.isLoading || hasChildren);

  const handleClick = () => {
    if (isDirectory) {
      onToggle(node);
    }
  };

  const paddingLeft = `${8 + level * 20}px`;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-3 hover:bg-gray-50 cursor-pointer text-sm group ${
          isDirectory ? "font-medium" : ""
        }`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {isDirectory && (
          <div className="w-4 h-4 flex items-center justify-center">
            {node.isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
            ) : canExpand ? (
              node.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )
            ) : null}
          </div>
        )}

        {!isDirectory && <div className="w-4" />}

        <div className="flex-shrink-0">
          {isDirectory ? (
            node.isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-gray-600" />
          )}
        </div>

        <span className="flex-1 truncate">
          {isDirectory ? (
            node.node.name
          ) : (
            <Link
              href={node.node.html_url}
              target="_blank"
              className="hover:text-blue-600 hover:underline flex items-center gap-1"
              onClick={e => e.stopPropagation()}
            >
              {node.node.name}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}
        </span>
      </div>

      {isDirectory && node.isExpanded && node.children && (
        <div>
          {node.children.map((child: TreeNodeData) => (
            <TreeNode key={child.node.path || child.node.name} node={child} level={level + 1} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

function LoadingFallback() {
  return (
    <div className="h-96 border rounded-lg flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading repository files...
      </div>
    </div>
  );
}

function Fallback({ error }: { error: string }) {
  return (
    <div className="h-96 border rounded-lg flex items-center justify-center">
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    </div>
  );
}

async function getPackageFile(packageName: string, path: string): Promise<GitHubItem[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/packages/${encodeURIComponent(packageName)}/file?path=${encodeURIComponent(path)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch package file: ${response.status}`);
  }

  return response.json();
}
