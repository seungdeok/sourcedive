"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBrowserParams } from "../(hooks)/useBrowserParam";

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/github/${values.githubRepo}`);
  }

  return (
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
  );
}
