// https://registry.npmjs.org/{package_name} 응답타입

export type PackageVersion = {
  name: string;
  version: string;
  keywords?: string[];
  author?: string | { name: string; email?: string; url?: string };
  license?: string;
  homepage?: string;
  description?: string;
  dist: {
    integrity: string;
    shasum: string;
    tarball: string;
    fileCount: number;
    unpackedSize: number;
    signatures?: {
      keyid: string;
      sig: string;
    }[];
  };
  main?: string;
  type?: string;
  types?: string;
  module?: string;
  _from?: string;
  exports?: Record<
    string,
    | string
    | {
        require?: string;
        import?: string;
        types?: string;
        default?: string;
      }
  >;
  engines?: Record<string, string>;
  os?: string[];
  cpu?: string[];
  scripts?: Record<string, string>;
  _npmUser?: {
    name: string;
    email: string;
    actor: {
      name: string;
      email: string;
      type: string;
    };
  };
  _resolved?: string;
  _integrity?: string;
  _npmVersion?: string;
  directories?: Record<string, string>;
  _nodeVersion?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  _hasShrinkwrap?: boolean;
  _npmOperationalInternal?: {
    host: string;
    tmp: string;
  };
  repository?:
    | string
    | {
        directory?: string;
        type: string;
        url: string;
      };
  gitHead?: string;
  bugs?: string | { url: string; email?: string };
};

export type PackageMetadata = {
  _id?: string;
  _rev?: string;
  name?: string;
  "dist-tags"?: {
    latest: string;
    [tag: string]: string;
  };
  versions?: Record<string, PackageVersion>;
  time?: Record<"created" | "modified" | string, string>;
  license?: string;
  keywords?: string[];
  description?: string;
  contributors?: Array<{
    name: string;
    email: string;
  }>;
  maintainers?: Array<{
    name: string;
    email: string;
  }>;
  readme?: string;
  readmeFilename?: string;
  repository?:
    | string
    | {
        type: string;
        url: string;
        directory?: string;
      };
  bugs?: string | { url?: string; email?: string };
};

export type PackageSize = {
  assets: {
    gzip: number;
    name: string;
    size: number;
    type: string;
  }[];
  dependencyCount: number;
  dependencySizes: {
    approximateSize: number;
    name: string;
  }[];
  description: string;
  gzip: number;
  hasJSModule: boolean;
  hasJSNext: boolean;
  hasSideEffects: boolean;
  isModuleType: boolean;
  name: string;
  repository: string;
  scoped: boolean;
  size: number;
  version: string;
};
