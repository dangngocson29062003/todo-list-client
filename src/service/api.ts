const API_URL="http://localhost:8080";

async function apiFetch(url: string, options: RequestInit) {
  const response = await fetch(url, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function login(email: string, password: string, rememberMe: boolean) {
  return apiFetch(`${API_URL}/users/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export function register(email: string, password: string) {
  return apiFetch(`${API_URL}/users/register`, {
    method: "POST",
    credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
}