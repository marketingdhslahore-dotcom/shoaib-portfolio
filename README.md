# S. M. Shoaib Portfolio

This is a static portfolio website. The portfolio chatbot/serverless API has been removed from this build.

## Deploy to Vercel
1. Upload this folder to your GitHub repository and import it into Vercel.
2. Set Framework Preset to **Other**.
3. Leave Build Command and Output Directory empty/default for a static HTML site.
4. Deploy. No API key or serverless function is required.

## Main files
- `index.html` — portfolio content and sections
- `style.css` and `premium.css` — styling and glass effects
- `app.js` and `premium.js` — visual interactions, scroll reveals and motion
- `assets/` — bundled images and hero video


## Responsive / video scroll update (2026-10-29)
- Added scroll-linked hero-video parallax and a gentle zoom effect on desktop and mobile.
- Kept a visible poster fallback when browser autoplay is blocked.
- Kept muted inline autoplay settings for iOS/Android compatibility.
- Added final mobile spacing/overflow safeguards for hero, cards, stack and navigation.
- Checked JavaScript syntax and verified all local HTML asset references.
- Note: real-device autoplay can still vary by browser, battery saver and data-saving settings.


## Why work with me card refresh (2026-10-29)
- Reworked the four Why Work With Me cards with distinct cobalt, gold, navy and teal treatments.
- Added staggered scroll-in reveals, hover lift, accent lighting and responsive single-column mobile layout.
- Kept the existing portfolio content and bundled media unchanged.
- Validation: checked local HTML asset paths and JavaScript syntax with Node.js.


## Deploy fix (2026-10-29)
- Files are now at the ZIP ROOT (index.html is not inside a sub-folder). Upload the CONTENTS of this folder to the GitHub repo root.
- New hero video/poster use new file names (hero-v2*.mp4/jpg) so Vercel/browsers can't serve the old cached copy.
- vercel.json no longer marks assets as "immutable"; html/css/js revalidate on every visit.
- CSS/JS links carry ?v=3 — bump the number when you change those files.
- fix.css adds final mobile/tablet fixes; content can no longer stay hidden by the scroll-reveal animation.

## Motion + grid update (2026-10-29)
- motion.css / motion.js: scroll reveals (slide, flip, zoom, clip-wipe), parallax pictures, 3D tilt on desktop, floating icons,
  marquee bands, ambient orbs, cursor spotlight, hero entrance. Respects prefers-reduced-motion and force-reveals content by timer.
- Agency pictures now sit in a 6-column picture-fitted grid (big tile + wide + small); 2 columns on tablet, 1 on phone.
- Unused dashboard screenshots are shown in a "Dashboard proof" grid under Results.
