export function apiGet(path: string) {
  return fetch(path, { credentials: "include" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiPost(path: string, body: any) {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
}
