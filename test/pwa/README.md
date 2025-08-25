# Full Offline PWA (Cloudflare Pages-ready)

## Deploy
1. Deploy the `public/` folder to Cloudflare Pages (set it as your build output or upload directly).
2. `_headers` ensures `service-worker.js` isn't cached by the CDN so updates are instant.
3. Visit the site once online; then go offline to verify it still works.

## How it works
- **service-worker.js** precaches **every file** in this folder (list generated at build time).
- Fetches are **cache-first** with network fallback.
- Bump `VERSION` in the service worker whenever you deploy new files.

## Customize
- Replace icons in `/icons` and logo in `/assets/images`.
- Edit `manifest.json` (name, colors, start_url).
- Add more pages/assets—then **regenerate the service worker** (rebuild).
