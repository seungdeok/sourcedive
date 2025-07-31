"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

type FileNode = d3.SimulationNodeDatum & {
  id: string;
  name: string;
  fullPath: string;
};

type FileLink = d3.SimulationLinkDatum<FileNode> & {
  source: string | FileNode;
  target: string | FileNode;
};

export function FileDependencyGraphViewer({
  githubRepo,
  entryFile,
}: { githubRepo?: string; entryFile: string | null }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const drawGraph = (dependencies: Record<string, string[]>) => {
      if (!svgRef.current) {
        return;
      }

      function dragstarted(event: d3.D3DragEvent<SVGGElement, FileNode, FileNode>) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGGElement, FileNode, FileNode>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGGElement, FileNode, FileNode>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = svg.attr("width") ? Number(svg.attr("width")) : 1024;
      const height = svg.attr("height") ? Number(svg.attr("height")) : 768;

      svg.attr("width", width).attr("height", height);
      svg.append("rect").attr("width", width).attr("height", height).attr("fill", "#1a1a1a");

      const container = svg.append("g");

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", event => {
          container.attr("transform", event.transform);
        });
      svg.call(zoom);

      const nodeSet = new Set<string>();
      const links: FileLink[] = [];

      for (const source of Object.keys(dependencies)) {
        nodeSet.add(source);
        for (const target of dependencies[source]) {
          nodeSet.add(target);
          links.push({ source, target });
        }
      }

      const nodes: FileNode[] = Array.from(nodeSet).map(id => ({
        id,
        name: id.split("/").pop() || id,
        fullPath: id,
      }));

      const simulation = d3
        .forceSimulation<FileNode>(nodes)
        .force(
          "link",
          d3
            .forceLink<FileNode, FileLink>(links)
            .id(d => d.id)
            .distance(80)
        )
        .force("charge", d3.forceManyBody<FileNode>().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const linkGroup = container
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

      const nodeGroup = container.append("g").attr("class", "nodes").selectAll("g").data(nodes).enter().append("g");

      nodeGroup.append("circle").attr("r", 40).attr("fill", "#666").attr("stroke", "#fff").attr("stroke-width", 1);

      nodeGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d: FileNode) => truncateText(d.name))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#e0e0e0");

      nodeGroup
        .style("cursor", "pointer")
        .call(d3.drag<SVGGElement, FileNode>().on("start", dragstarted).on("drag", dragged).on("end", dragended))
        .on("mouseover", function (event, d: FileNode) {
          const connectedNodes = new Set([d.id]);

          for (const link of links) {
            const sourceId = typeof link.source === "string" ? link.source : link.source.id;
            const targetId = typeof link.target === "string" ? link.target : link.target.id;

            if (sourceId === d.id) {
              connectedNodes.add(targetId);
            }
            if (targetId === d.id) {
              connectedNodes.add(sourceId);
            }
          }

          nodeGroup.select("circle").attr("fill", (nodeData: FileNode) => {
            if (nodeData.id === d.id) return "#ff6b6b";
            if (connectedNodes.has(nodeData.id)) return "#ffa726";
            return "#666";
          });

          linkGroup.attr("stroke", (linkData: FileLink) => {
            const sourceId = typeof linkData.source === "string" ? linkData.source : linkData.source.id;
            const targetId = typeof linkData.target === "string" ? linkData.target : linkData.target.id;
            return sourceId === d.id || targetId === d.id ? "#ff6b6b" : "#333";
          });

          d3.select(this).select("text").text(d.fullPath).style("fill", "white");
        })
        .on("mouseout", function (event, d: FileNode) {
          nodeGroup.select("circle").attr("fill", "#666");
          linkGroup.attr("stroke", "#333");

          d3.select(this).select("text").text(truncateText(d.name)).style("fill", "#e0e0e0");
        });

      simulation.on("tick", () => {
        linkGroup
          .attr("x1", (d: FileLink) => {
            const source = d.source as FileNode;
            return source.x || 0;
          })
          .attr("y1", (d: FileLink) => {
            const source = d.source as FileNode;
            return source.y || 0;
          })
          .attr("x2", (d: FileLink) => {
            const target = d.target as FileNode;
            return target.x || 0;
          })
          .attr("y2", (d: FileLink) => {
            const target = d.target as FileNode;
            return target.y || 0;
          });

        nodeGroup.attr("transform", (d: FileNode) => `translate(${d.x || 0}, ${d.y || 0})`);
      });
    };

    fetch(`/api/github/dependency?entryFile=${entryFile}&githubRepo=https://github.com/${githubRepo}`)
      .then(res => res.json())
      .then(data => {
        const dependencies = data.dependencies || {};
        drawGraph(dependencies);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [entryFile, githubRepo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            data-testid="loading-spinner"
          />
          <p className="text-gray-600">loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">의존성 그래프</h3>
        <p className="text-sm text-gray-600">
          <strong>Entry File:</strong> {entryFile}
        </p>
      </div>

      <div className="border rounded-lg bg-white p-4">
        <svg ref={svgRef} className="w-full" style={{ maxWidth: "100%" }} data-testid="dependency-graph" />
      </div>
    </div>
  );
}

function truncateText(text: string, maxLength = 12): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength - 3)}...`;
}
