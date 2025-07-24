"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBrowserParams } from "../(hooks)/useBrowserParam";

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/packages/${values.packageName}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="packageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="패키지명을 입력해주세요" {...field} />
                </FormControl>
                <Button type="submit" className="self-end h-[36px]">
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
  );
}
