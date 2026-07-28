const OWNER = 'SamanKC';
const REPO = 'samankc.com';
const BLOG_PATH = 'content/blog';
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export type GithubFile = { name: string; sha: string };

export class GithubApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'GithubApiError';
    this.status = status;
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };
}

async function parseErrorResponse(res: Response): Promise<never> {
  let message = res.statusText;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch {
    // response body wasn't JSON — fall back to statusText
  }
  throw new GithubApiError(res.status, message);
}

function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64.replace(/\n/g, ''))));
}

export async function listPosts(token: string): Promise<GithubFile[]> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}`, { headers: authHeaders(token) });
  if (!res.ok) return parseErrorResponse(res);
  const files = (await res.json()) as Array<{ name: string; sha: string }>;
  return files.filter((f) => f.name.endsWith('.md')).map((f) => ({ name: f.name, sha: f.sha }));
}

export async function getPost(token: string, filename: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}/${filename}`, { headers: authHeaders(token) });
  if (!res.ok) return parseErrorResponse(res);
  const body = (await res.json()) as { content: string; sha: string };
  return { content: decodeBase64(body.content), sha: body.sha };
}

export async function savePost(
  token: string,
  filename: string,
  content: string,
  sha?: string
): Promise<{ sha: string }> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}/${filename}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `${sha ? 'Update' : 'Add'} post: ${filename}`,
      content: encodeBase64(content),
      sha,
    }),
  });
  if (!res.ok) return parseErrorResponse(res);
  const body = (await res.json()) as { content: { sha: string } };
  return { sha: body.content.sha };
}

export async function deletePost(token: string, filename: string, sha: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}/${filename}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Delete post: ${filename}`, sha }),
  });
  if (!res.ok) return parseErrorResponse(res);
}
