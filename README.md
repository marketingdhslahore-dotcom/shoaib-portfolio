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
