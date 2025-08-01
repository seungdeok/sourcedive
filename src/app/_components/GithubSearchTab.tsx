"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useBrowserParams } from "@/hooks/useBrowserParams";
import { useDebounce } from "@/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const { get, add } = useSearchHistory({ maxItems: 5, storageKey: "github_search_history" });
  const recentKeywords = get();
  const [open, setOpen] = useState(false);
  const debouncedKeyword = useDebounce(form.watch("githubRepo"), 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    add(values.githubRepo);
    router.push(`/github/${values.githubRepo}`);
  }

  const handleClickKeyword = (keyword: string) => {
    router.push(`/github/${keyword}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (form.getValues("githubRepo")) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  useEffect(() => {
    if (debouncedKeyword && debouncedKeyword.length > 1) {
      fetch(`https://api.github.com/search/repositories?q=${debouncedKeyword}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.items.map((item: { full_name: string }) => item.full_name));
        });
    }
  }, [debouncedKeyword]);

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
                  <div className="flex-1 relative">
                    <Command className="rounded-lg border">
                      <CommandInput
                        value={field.value}
                        onValueChange={field.onChange}
                        onKeyDown={handleKeyDown}
                        placeholder="repository 이름을 입력해주세요"
                        onFocus={() => setOpen(true)}
                        onBlur={() => setTimeout(() => setOpen(false), 200)}
                      />
                      {open && (
                        <CommandList>
                          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                          {recentKeywords?.length > 0 && (
                            <CommandGroup heading="최근 검색어">
                              {recentKeywords.map(keyword => (
                                <CommandItem
                                  key={keyword}
                                  value={keyword}
                                  onSelect={() => handleClickKeyword(keyword)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{keyword}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          <CommandSeparator />
                          {suggestions?.length > 0 && (
                            <CommandGroup heading="추천 검색어">
                              {suggestions.map(keyword => (
                                <CommandItem
                                  key={keyword}
                                  value={keyword}
                                  onSelect={() => handleClickKeyword(keyword)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>{keyword}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      )}
                    </Command>
                  </div>
                  <Button type="submit" className="self-start h-[36px]">
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
    </div>
  );
}
