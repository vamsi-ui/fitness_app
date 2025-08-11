# Level Up Fitness (Project Monarch) - Prototype

This is a Vite + React prototype for the **Level Up Fitness** app (formerly Project Monarch).
It includes the 7-day plan and embeddable YouTube guides, plus a simple in-app settings editor
where users can customize their weekly plan (stored in localStorage).

## Quick start (locally)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deploy to Vercel (recommended)

1. Create a new GitHub repo and push the project.
2. Go to https://vercel.com and import your repo.
3. Vercel should auto-detect a Vite app. Set build command `npm run build` and output directory `dist`.
4. Deploy — you'll get a live `.vercel.app` URL.

## Deploy to Netlify

1. Push to GitHub.
2. On Netlify, create a new site from Git.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy.

## Notes

- Videos use YouTube embed URLs and require no extra config.
- Plan editor saves to `localStorage` for now; you can integrate Firebase/Firestore for persistence.
- Tailwind CSS is configured; run `npm install` to fetch required packages.

Enjoy!