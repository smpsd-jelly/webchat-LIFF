export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
  });
  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res;
}
