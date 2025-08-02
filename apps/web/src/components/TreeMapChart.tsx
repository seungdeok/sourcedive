"use client";

import BillboardJS from "@billboard.js/react";
import bb, { type ChartOptions, treemap } from "billboard.js";

// https://naver.github.io/billboard.js/demo/#Chart.TreemapChart
export default function TreeMapChart({ data }: { data: [string, number][] }) {
  const options: ChartOptions = {
    treemap: {
      label: {
        show: true,
        threshold: 0.03,
        format: (value, ratio, id) => {
          return `${id} ${(ratio * 100).toFixed(2)}%`;
        },
      },
    },
    data: {
      columns: data,
      type: treemap(),
      labels: {
        colors: "#fff",
      },
    },
  };

  return (
    <BillboardJS
      bb={bb}
      options={options}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
      }}
    />
  );
}
