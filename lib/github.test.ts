import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listPosts, getPost, savePost, deletePost } from './github';

function mockFetchOnce(status: number, body: unknown) {
  const ok = status >= 200 && status < 300;
  (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok,
    status,
    statusText: 'Error',
    json: async () => body,
  });
}

beforeEach(() => {
  global.fetch = vi.fn();
});

describe('listPosts', () => {
  it('requests the blog directory and returns only .md files', async () => {
    mockFetchOnce(200, [
      { name: 'post-one.md', sha: 'sha1' },
      { name: 'post-two.md', sha: 'sha2' },
      { name: '.gitkeep', sha: 'sha3' },
    ]);

    const files = await listPosts('test-token');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    );
    expect(files).toEqual([
      { name: 'post-one.md', sha: 'sha1' },
      { name: 'post-two.md', sha: 'sha2' },
    ]);
  });

  it('throws a GithubApiError with the response status on failure', async () => {
    mockFetchOnce(401, { message: 'Bad credentials' });

    await expect(listPosts('bad-token')).rejects.toMatchObject({
      status: 401,
      message: 'Bad credentials',
    });
  });
});

describe('getPost', () => {
  it('decodes base64 content and returns the sha', async () => {
    const encoded = Buffer.from('---\ntitle: Test\n---\nBody').toString('base64');
    mockFetchOnce(200, { content: encoded, sha: 'file-sha' });

    const result = await getPost('test-token', 'test-post.md');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog/test-post.md',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    );
    expect(result).toEqual({ content: '---\ntitle: Test\n---\nBody', sha: 'file-sha' });
  });
});

describe('savePost', () => {
  it('PUTs base64-encoded content without a sha when creating', async () => {
    mockFetchOnce(201, { content: { sha: 'new-sha' } });

    const result = await savePost('test-token', 'new-post.md', 'Hello world');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog/new-post.md',
      expect.objectContaining({ method: 'PUT' })
    );
    const call = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(call[1].body as string);
    expect(sentBody.sha).toBeUndefined();
    expect(Buffer.from(sentBody.content, 'base64').toString()).toBe('Hello world');
    expect(result).toEqual({ sha: 'new-sha' });
  });

  it('PUTs with a sha when updating', async () => {
    mockFetchOnce(200, { content: { sha: 'updated-sha' } });

    await savePost('test-token', 'existing-post.md', 'Updated body', 'old-sha');

    const call = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(call[1].body as string);
    expect(sentBody.sha).toBe('old-sha');
  });
});

describe('deletePost', () => {
  it('DELETEs with the sha in the body', async () => {
    mockFetchOnce(200, {});

    await deletePost('test-token', 'old-post.md', 'file-sha');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog/old-post.md',
      expect.objectContaining({ method: 'DELETE' })
    );
    const call = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(call[1].body as string);
    expect(sentBody.sha).toBe('file-sha');
  });
});
