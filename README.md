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

After editing, re-run `npm run build` and re-upload `out/`.
