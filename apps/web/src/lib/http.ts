import * as Sentry from "@sentry/nextjs";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternetServerError extends ApiError {
  constructor(message: string) {
    super(message, 500);
  }
}

export async function http(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = 60000, ...fetchOptions } = options;
  const method = options?.method ?? "GET";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let error: ApiError;
      if (response.status === 400) {
        error = new BadRequestError(response.statusText || "Bad Request");
      } else if (response.status === 404) {
        error = new NotFoundError(response.statusText || "Not Found");
      } else if (response.status === 500) {
        error = new InternetServerError(response.statusText || "Internet Server Error");
      } else {
        error = new ApiError(`HTTP Error: ${response.status}`, response.status);
      }

      if (error.status >= 500) {
        Sentry.withScope(scope => {
          scope.setFingerprint([method, response.status.toString(), url]);
          scope.setContext("app", {
            version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown",
          });
          scope.setContext("response", {
            status: response.status,
            message: error.message,
            url,
            method,
          });
          scope.setLevel("error");
          scope.setTag("source", "api");
          Sentry.captureException(error);
        });
      }

      throw error;
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      Sentry.withScope(scope => {
        scope.setFingerprint([method, "unknown error", url]);
        scope.setContext("app", {
          version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown",
        });
        scope.setContext("request", { url, method, timeout });
        scope.setLevel("error");
        scope.setTag("source", "api");
        Sentry.captureException(error);
      });
    }

    throw error;
  }
}
