import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

const SearchTab = lazy(() => import("./SearchTab"));
// const UploadTab = lazy(() => import("./UploadTab"));

export function MainTabs() {
  return (
    <div className="w-full">
      <Tabs defaultValue="search">
        <TabsList>
          <TabsTrigger value="search">🔍 검색</TabsTrigger>
          <TabsTrigger value="upload">📁 업로드</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <Suspense fallback={<GlobalLoadingFallback />}>
            <SearchTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          Update Tab
        </TabsContent>
      </Tabs>
    </div>
  );
}
