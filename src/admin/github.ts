/*
 * Browser-side GitHub Contents API client for the admin panel.
 *
 * Auth model: the user pastes a GitHub Personal Access Token (fine-grained,
 * scoped to this one repo with Contents: Read and write). The token is
 * validated against the repo and, only if it checks out, kept in memory +
 * sessionStorage. GitHub enforces the auth server-side; there is no way to
 * read or write without a valid token that has write access to this repo.
 */

const OWNER = "acnologiaslayer";
const REPO = "acnologiaslayer.github.io";
const BRANCH = "master";
const ARTICLES_DIR = "src/content/articles";
const API = "https://api.github.com";

const TOKEN_KEY = "gh_admin_token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// UTF-8 safe base64 (btoa/atob are latin1-only).
function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function decodeBase64(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export type AuthResult = {
  ok: boolean;
  login?: string;
  canWrite?: boolean;
  error?: string;
};

/* Validate a token: it must resolve to a user AND have push access to the repo. */
export async function validateToken(token: string): Promise<AuthResult> {
  try {
    const repoRes = await fetch(`${API}/repos/${OWNER}/${REPO}`, {
      headers: headers(token),
    });
    if (repoRes.status === 401) return { ok: false, error: "Invalid or expired token." };
    if (!repoRes.ok) return { ok: false, error: `GitHub error ${repoRes.status}.` };
    const repo = await repoRes.json();
    const canWrite = !!repo.permissions?.push;
    if (!canWrite)
      return { ok: false, error: "Token lacks write (push) access to this repo." };

    let login: string | undefined;
    const userRes = await fetch(`${API}/user`, { headers: headers(token) });
    if (userRes.ok) login = (await userRes.json()).login;
    return { ok: true, login, canWrite };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export type ArticleFile = {
  name: string; // filename e.g. my-post.md
  slug: string; // filename without .md
  path: string; // full repo path
  sha: string; // blob sha (needed for update/delete)
};

export async function listArticles(token: string): Promise<ArticleFile[]> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${ARTICLES_DIR}?ref=${BRANCH}`,
    { headers: headers(token) }
  );
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  const items = (await res.json()) as Array<{ name: string; path: string; sha: string; type: string }>;
  return items
    .filter((i) => i.type === "file" && i.name.endsWith(".md"))
    .map((i) => ({
      name: i.name,
      slug: i.name.replace(/\.md$/, ""),
      path: i.path,
      sha: i.sha,
    }))
    .sort((a, b) => (a.slug < b.slug ? -1 : 1));
}

export async function readArticle(
  token: string,
  slug: string
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${ARTICLES_DIR}/${slug}.md?ref=${BRANCH}`,
    { headers: headers(token) }
  );
  if (!res.ok) throw new Error(`Read failed: ${res.status}`);
  const data = await res.json();
  return { content: decodeBase64(data.content), sha: data.sha };
}

/* Create or update a file. Pass sha to update an existing file. */
export async function saveArticle(
  token: string,
  slug: string,
  markdown: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${ARTICLES_DIR}/${slug}.md`,
    {
      method: "PUT",
      headers: { ...headers(token), "content-type": "application/json" },
      body: JSON.stringify({
        message,
        content: encodeBase64(markdown),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  );
  if (!res.ok) throw new Error(`Save failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return { sha: data.content.sha };
}

export async function deleteArticle(
  token: string,
  slug: string,
  sha: string,
  message: string
): Promise<void> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${ARTICLES_DIR}/${slug}.md`,
    {
      method: "DELETE",
      headers: { ...headers(token), "content-type": "application/json" },
      body: JSON.stringify({ message, sha, branch: BRANCH }),
    }
  );
  if (!res.ok) throw new Error(`Delete failed: ${res.status} ${await res.text()}`);
}

export const REPO_INFO = { OWNER, REPO, BRANCH, ARTICLES_DIR };
