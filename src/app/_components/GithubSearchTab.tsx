"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBrowserParams } from "@/hooks/useBrowserParams";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchHistory } from "../_hooks/useSearchHistory";

const githubRepoSchema = z.string().regex(/^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_.]+$/, {
  message: "owner/repository 형태로 입력해주세요.",
});

const formSchema = z.object({
  githubRepo: githubRepoSchema,
});

export default function GithubSearchTab() {
  const { params } = useBrowserParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubRepo: params.githubRepo ?? "",
    },
  });

  const { get, add, remove } = useSearchHistory({ maxItems: 5, storageKey: "github_search_history" });
  const [recentSearches, setRecentSearches] = useState<string[]>(get());

  function onSubmit(values: z.infer<typeof formSchema>) {
    add(values.githubRepo);
    router.push(`/github/${values.githubRepo}`);
  }

  const handleRecentSearchClick = (packageName: string) => {
    router.push(`/packages/${packageName}`);
  };

  const handleRemoveRecentSearch = (packageName: string) => {
    remove(packageName);
    setRecentSearches(get());
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="githubRepo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository Name</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="repository 이름을 입력해주세요" {...field} />
                  </FormControl>
                  <Button type="submit" className="self-end h-[36px]">
                    🔍 검색
                  </Button>
                </div>
                <FormDescription>repository 이름을 입력하세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {recentSearches.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            최근 검색어
          </h3>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map(key => (
              <div
                key={key}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold transition-colors py-2 pl-4 pr-2 cursor-pointer"
              >
                <Button
                  variant="ghost"
                  onClick={() => handleRecentSearchClick(key)}
                  className="p-0 h-auto hover:bg-transparentfont-semibold text-xs"
                >
                  {key}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRecentSearch(key)}
                  className="h-6 w-6 p-0 hover:bg-gray-300 ml-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
