export function decodePackageName(packagePath: string[]): string {
  const fullPath = packagePath.join("/");
  return decodeURIComponent(fullPath);
}
