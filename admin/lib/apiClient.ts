const RAW_SERVER_URI =
  process.env.NEXT_PUBLIC_SERVER_URI ||
  process.env.SERVER_URI ||
  "http://localhost:2020/api/v1";

export const SERVER_URI = RAW_SERVER_URI.replace(/\/+$/, "");

export function getAuthHeaders(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_access_token");
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null as any);
    }
  });
  failedQueue = [];
};

/**
 * Fetch wrapper that automatically appends Bearer access token headers,
 * intercepts 401 Unauthorized responses, attempts refresh token exchange via
 * the server refresh-token endpoint, and retries the original request seamlessly.
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {},
  isRetry = false
): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401 && !isRetry) {
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => adminFetch(url, options, true));
    }

    isRefreshing = true;
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("admin_refresh_token") : null;

    try {
      const refreshResponse = await fetch(`${SERVER_URI}/admin/account/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const refreshData = await refreshResponse.json();

      if (refreshResponse.ok && refreshData.success && refreshData.data?.access_token) {
        const newAccessToken = refreshData.data.access_token;
        const newRefreshToken = refreshData.data.refresh_token;

        if (typeof window !== "undefined") {
          localStorage.setItem("admin_access_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("admin_refresh_token", newRefreshToken);
          }
        }

        processQueue(null);
        isRefreshing = false;

        // Retry the original request with the new access token
        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

        return await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        });
      } else {
        // Refresh failed (invalid/expired refresh token)
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("admin_refresh_token");
          localStorage.removeItem("admin_user_data");
        }
        processQueue(new Error("Session expired. Please sign in again."));
        isRefreshing = false;
      }
    } catch (refreshErr) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        localStorage.removeItem("admin_user_data");
      }
      processQueue(refreshErr);
      isRefreshing = false;
    }
  }

  return response;
}
