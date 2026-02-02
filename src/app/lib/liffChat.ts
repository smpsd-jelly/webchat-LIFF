import liff from "@line/liff";

export async function initLiff() {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) throw new Error("Missing NEXT_PUBLIC_LIFF_ID");
  await liff.init({ liffId });
}

export function isLoggedIn() {
  return liff.isLoggedIn();
}

export function login() {
  liff.login();
}

export function logout() {
  liff.logout();
}

export function isInClient() {
  return liff.isInClient();
}

export function getIdToken() {
  return liff.getIDToken();
}

export async function getFriendshipFlag(): Promise<boolean> {
  const fr = await liff.getFriendship();
  return !!fr?.friendFlag;
}

export async function openAddFriend(url: string) {
  if (!url) throw new Error("Missing add-friend URL");
  liff.openWindow({ url, external: true });
}

export async function sendTextMessage(text: string) {
  await liff.sendMessages([{ type: "text", text }]);
}
