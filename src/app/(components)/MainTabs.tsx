"use client";

import { useState } from "react";

type TabType = "search" | "upload";

export function MainTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("search");

  const tabs = [
    { id: "search", label: "패키지 검색", icon: "🔍" },
    { id: "upload", label: "파일 업로드", icon: "📁" },
  ];

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-96">
        {/* {activeTab === "search" && <SearchTab />}
        {activeTab === "upload" && <UploadTab />} */}
      </div>
    </div>
  );
}
