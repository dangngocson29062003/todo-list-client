import { api } from "../lib/api-client";

export function login(email: string, password: string, rememberMe: boolean) {
  return api(`/users/login`, {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export function register(email: string, password: string) {
  return api(`/users/register`, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function refresh() {
  return api(`/users/refresh`, {
    method: "POST"
  });
}

export function getMe() {
  return api(`/users/getMe`, {
    method: "GET"
  });
}

