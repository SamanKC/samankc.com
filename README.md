# Personal Website

Next.js (App Router) + TypeScript + Tailwind CSS personal portfolio site, statically exported for Hostinger shared hosting.

## Development

    npm install
    npm run dev

Open http://localhost:3000.

## Testing

    npm test

## Build & deploy to Hostinger

    npm run build

This produces a static `out/` folder. Upload the **contents** of `out/` (not the folder itself) to your Hostinger `public_html` directory (or a subfolder, if hosting under a path) via the Hostinger File Manager or an FTP client. No Node.js server is required — it's all static files.

## Adding your real content

All placeholder content lives in a few centralized files:

- `data/profile.ts` — name, title, bio, social links, resume path
- `data/projects.ts` — project list (edit or add entries; each needs a unique `slug`)
- `data/timeline.ts` — jobs, education, and achievements (rendered as one chronological timeline on `/about`)
- `content/blog/*.md` — blog posts (add a new `.md` file with frontmatter `title`, `date`, `excerpt`, `tags` to publish a new post)
- `public/resume-placeholder.pdf` — replace with your real resume PDF (keep the filename, or update `resumeUrl` in `data/profile.ts`)
- `public/og-image.svg` — replace with a real 1200x630 PNG/JPG for better social-share previews

`app/layout.tsx`'s site-wide title/description (and Open Graph tags) derive automatically from `data/profile.ts` — no separate edit needed there.

Once you have a real deployed domain, update `metadataBase` in `app/layout.tsx` (currently `https://your-domain-here.com`) so Open Graph/social-share URLs resolve correctly.

After editing, re-run `npm run build` and re-upload `out/`.

## Using the admin editor

Instead of editing `content/blog/*.md` directly, you can manage posts from `/admin` on the live site:

1. Create a GitHub personal access token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → generate one scoped to **only** the `samankc.com` repository, with **Contents: Read and write** permission and no other permissions.
2. Visit `yourdomain.com/admin` and paste the token in when prompted. It's saved only in that browser's local storage.
3. Create, edit, or delete posts from there. Every save commits directly to `main` and triggers the existing GitHub Actions deploy — changes go live within a couple of minutes, the same as pushing from your machine.
4. Use "Forget token" on that page if you ever want to clear it from a shared or public computer.
