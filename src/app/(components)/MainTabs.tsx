import { GlobalLoadingFallback } from "@/components/GlobalLoadingFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, lazy } from "react";

const SearchTab = lazy(() => import("./SearchTab"));
const ExternalTab = lazy(() => import("./ExternalTab"));

export function MainTabs() {
  return (
    <div className="w-full">
      <Tabs defaultValue="npm">
        <TabsList>
          <TabsTrigger value="npm">🔍 NPM 검색</TabsTrigger>
          <TabsTrigger value="github">🔍 Github 검색</TabsTrigger>
          <TabsTrigger value="external">📁 외부파일</TabsTrigger>
        </TabsList>

        <TabsContent value="npm" className="mt-6">
          <Suspense fallback={<GlobalLoadingFallback />}>
            <SearchTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="github" className="mt-6">
          <Suspense fallback={<GlobalLoadingFallback />}>
            <SearchTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="external" className="mt-6">
          <Suspense fallback={<GlobalLoadingFallback />}>
            <ExternalTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
