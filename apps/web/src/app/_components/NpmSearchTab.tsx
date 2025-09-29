"use client";

import { useSearchHistory } from "@/app/_hooks/useSearchHistory";
import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBrowserParams } from "@/hooks/useBrowserParams";
import { useDebounce } from "@/hooks/useDebounce";
import { http } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const packageNameSchema = z
  .string()
  .nonempty({ message: "패키지 이름은 비워둘 수 없습니다." })
  .regex(/^(?:@[a-z0-9-_]+\/)?[a-z0-9-_]+$/, {
    message: "영문 소문자, 숫자, 하이픈(-), 언더스코어(_)와 스코프(@scope/)만 사용할 수 있습니다.",
  });

const formSchema = z.object({
  packageName: packageNameSchema,
});

export default function SearchTab() {
  const { params } = useBrowserParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageName: params.packageName ?? "",
    },
  });
  const { get, add } = useSearchHistory({ maxItems: 5, storageKey: "npm_search_history" });
  const recentKeywords = get();
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [keyword, setKeyword] = useState(params.packageName ?? "");
  const allItems = useMemo(() => [...recentKeywords, ...suggestions], [recentKeywords, suggestions]);
  const debouncedKeyword = useDebounce(keyword, 300);

  const addKeyword = (packageName: string) => {
    add(packageName);
    router.push(`/packages/${packageName}`);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    addKeyword(values.packageName);
  }

  const handleClickKeyword = (keyword: string) => {
    addKeyword(keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = selectedIndex < allItems.length - 1 ? selectedIndex + 1 : -1;
      setSelectedIndex(nextIndex);

      if (nextIndex === -1) {
        setKeyword(keyword);
        form.setValue("packageName", keyword);
      } else {
        form.setValue("packageName", allItems[nextIndex]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = selectedIndex <= 0 ? -1 : selectedIndex - 1;
      setSelectedIndex(prevIndex);

      if (prevIndex === -1) {
        setKeyword(keyword);
        form.setValue("packageName", keyword);
      } else {
        form.setValue("packageName", allItems[prevIndex]);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();

      form.handleSubmit(onSubmit)();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSelectedIndex(-1);
      form.setValue("packageName", keyword);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    form.setValue("packageName", value);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    if (debouncedKeyword && debouncedKeyword.length > 1) {
      http(`https://api.npms.io/v2/search/suggestions?q=${debouncedKeyword}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.map((item: { package: { name: string } }) => item.package.name));
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedKeyword]);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="packageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      {...field}
                      onKeyDown={handleKeyDown}
                      onChange={handleChange}
                      placeholder="패키지명을 입력해주세요"
                      onFocus={() => setOpen(true)}
                      onBlur={() => setTimeout(() => setOpen(false), 200)}
                    />
                    {open && allItems.length > 0 && (
                      <div
                        data-testid="npm-search-suggestions"
                        className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
                      >
                        {recentKeywords.length > 0 && (
                          <>
                            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b">최근 검색어</div>
                            {recentKeywords.map((keyword, index) => (
                              <div
                                key={keyword}
                                aria-label={keyword}
                                aria-selected={selectedIndex === index}
                                onClick={() => handleClickKeyword(keyword)}
                                className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                                  selectedIndex === index ? "bg-gray-100" : "hover:bg-gray-50"
                                }`}
                              >
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{keyword}</span>
                              </div>
                            ))}
                          </>
                        )}
                        {suggestions.length > 0 && (
                          <>
                            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b">추천 검색어</div>
                            {suggestions.map((keyword, index) => {
                              const actualIndex = recentKeywords.length + index;
                              return (
                                <div
                                  key={keyword}
                                  aria-label={keyword}
                                  aria-selected={selectedIndex === actualIndex}
                                  onClick={() => handleClickKeyword(keyword)}
                                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                                    selectedIndex === actualIndex ? "bg-gray-100" : "hover:bg-gray-50"
                                  }`}
                                >
                                  <Search className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{keyword}</span>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Button type="submit">🔍 검색</Button>
                </div>
                <FormDescription>패키지 이름을 입력하세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
