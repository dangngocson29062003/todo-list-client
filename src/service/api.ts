const API_URL = "http://localhost:8080";
let refreshPromise: Promise<void> | null = null;

async function apiFetch(url: string, options: RequestInit, retry = true) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
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
      return apiFetch(url, options, false);
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
        console.log(newToken)

        localStorage.setItem("token", newToken);

      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export function login(email: string, password: string, rememberMe: boolean) {
  return apiFetch(`${API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export function register(email: string, password: string) {
  return apiFetch(`${API_URL}/users/register`, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function refresh() {
  return apiFetch(`${API_URL}/users/refresh`, {
    method: "POST"
  });
}

export function getMe() {
  return apiFetch(`${API_URL}/users/getMe`, {
    method: "GET"
  });
}