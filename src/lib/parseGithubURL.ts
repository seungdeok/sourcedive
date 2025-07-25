export function parseGithubURL(url: string): { owner: string; repo: string } | null {
  const patterns = [
    // git+https://github.com/facebook/react.git
    /^git\+https:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git$/,

    // https://github.com/facebook/react.git
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git$/,

    // https://github.com/facebook/react
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/,

    // git://github.com/facebook/react.git
    /^git:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git$/,

    // git@github.com:facebook/react.git (SSH)
    /^git@github\.com:([^\/]+)\/([^\/]+)\.git$/,

    // github.com/facebook/react (프로토콜 없음)
    /^github\.com\/([^\/]+)\/([^\/]+)\/?$/,

    // facebook/react (owner/repo 형태)
    /^([^\/\s]+)\/([^\/\s]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }
  }

  return null;
}
