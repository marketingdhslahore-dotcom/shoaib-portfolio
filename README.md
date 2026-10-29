# S. M. Shoaib portfolio (v5, live AI)
1. Push this folder to GitHub, import in Vercel (Framework Preset: Other, no build command).
2. Project > Settings > Environment Variables: add ANTHROPIC_API_KEY (your key). Optional: CHAT_MODEL, QA_MODEL.
3. Redeploy. The "Ask my AI" section then uses /api/chat (Claude + tools + QA gate). Without the key it falls back to retrieval-only.
Never put the key in index.html or app.js.


## Emerald neural motion update
- Added a responsive neural-context section with animated connected nodes, orbit rings, and an AI core.
- Added image-backed atmospheric layers using bundled portfolio assets; no external image dependency added.
- Existing app.js, chat endpoint, knowledge base, voice controls, project content, and deployment configuration remain in place.
- Reduced-motion preferences are respected for the new motion graphics.
