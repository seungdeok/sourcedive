import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queries = createQueryKeyStore({
  github: {
    all: null,
    detail: (githubRepo: string) => ({
      queryKey: [githubRepo],
      contextQueries: {
        dependency: (entryFile: string) => ({ queryKey: ["dependency", entryFile] }),
      },
    }),
  },
  packages: {
    all: null,
    detail: (packageName: string) => ({
      queryKey: [packageName],
      contextQueries: {
        file: (path: string) => ({ queryKey: ["file", path] }),
        size: () => ({ queryKey: ["size"] }),
      },
    }),
  },
  ranking: {
    all: null,
    list: (limit: number) => ({
      queryKey: ["list", limit],
    }),
  },
});
