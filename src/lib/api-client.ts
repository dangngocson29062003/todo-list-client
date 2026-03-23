const API_URL = "http://localhost:8080";
let refreshPromise: Promise<void> | null = null;

export async function api(url: string, options: RequestInit & { params?: Record<string, any> }, retry = true) {
  const token = localStorage.getItem("token");

  let finalUrl = `${API_URL}${url}`;

  if (options.params) {
    const filteredParams = Object.fromEntries(
      Object.entries(options.params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(filteredParams).length > 0) {
      const queryString = new URLSearchParams(filteredParams).toString();
      finalUrl += `?${queryString}`;
    }
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers: {
      "Content-type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (response.status === 401 && retry) {
    try {
      await refreshLock();
      return api(url, options, false);
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  const res = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(res.message || "Request failed");
  }

  return res.data;
}

////
async function refreshLock(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Refresh failed");

        const data = await res.json();
        const newToken = data.data;
        console.log(newToken);

        localStorage.setItem("token", newToken);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

