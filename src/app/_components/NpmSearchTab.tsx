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
  const debouncedKeyword = useDebounce(form.watch("packageName"), 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    add(values.packageName);
    router.push(`/packages/${values.packageName}`);
  }

  const handleClickKeyword = (keyword: string) => {
    router.push(`/packages/${keyword}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (form.getValues("packageName")) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  useEffect(() => {
    if (debouncedKeyword && debouncedKeyword.length > 1) {
      fetch(`https://api.npms.io/v2/search/suggestions?q=${debouncedKeyword}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.map((item: { package: { name: string } }) => item.package.name));
        });
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
                    <Command className="rounded-lg border">
                      <CommandInput
                        value={field.value}
                        onValueChange={field.onChange}
                        onKeyDown={handleKeyDown}
                        placeholder="패키지명을 입력해주세요"
                        onFocus={() => setOpen(true)}
                        onBlur={() => setTimeout(() => setOpen(false), 200)}
                      />
                      {open && (
                        <CommandList>
                          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                          {recentKeywords.length > 0 && (
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
