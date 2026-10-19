# Watch Party — Build Notes

Static comedy-episode website ("earning website"). Plain HTML/CSS/JS, no build step —
deploy by drag-drop to Netlify (same as the Leatherone site) or via a connected GitHub repo.

## File structure

```
comedy_episodes_site/
├── index.html          # Home: hero + episode grid (renders from episodes.json, newest first)
├── watch.html          # Watch page: reads ?ep=<id>, YouTube (youtube-nocookie) embed,
│                       #   title, description, prev/next links, "More Episodes" sidebar
├── about.html          # About page (ad networks like seeing this)
├── contact.html        # Contact page — RAJ: replace the placeholder email inside
├── privacy.html        # Privacy Policy (mentions ad cookies + YouTube embeds)
├── episodes.json       # Episode data — edited by Raj via /admin (Decap CMS)
├── sitemap.xml         # RAJ: replace https://watchparty.netlify.app with the real URL
├── robots.txt          # Same URL replacement as sitemap.xml
├── admin/
│   ├── index.html      # Decap CMS panel (same login flow as Leatherone /admin)
│   └── config.yml      # "Episodes" collection → writes to episodes.json
└── assets/
    ├── style.css       # Dark cinematic theme, mobile-first, no emojis
    └── site.js         # Shared helpers: loadEpisodes, grid render, thumbnails
```

## Ad slots — where Raj pastes his Adsterra codes

Raj owns the Adsterra account; every slot below is a clearly-commented EMPTY placeholder.
He pastes each code exactly where the HTML comment says.

| # | Slot | Page | Location | What to paste |
|---|------|------|----------|---------------|
| 1 | SITE-OPEN AD | index.html, watch.html | inside `<head>` | Adsterra **Popunder** (or Interstitial) code — fires as soon as the website opens |
| 2 | SOCIAL BAR | index.html, watch.html | just before `</body>` | Adsterra **Social Bar** code — floating ads keep appearing while visitors browse/watch |
| 3 | BANNER 728x90 | index.html | below header | Adsterra **Banner 728x90** (Leaderboard) code |
| 4 | BANNER 728x90 | watch.html | above the video player | Adsterra **Banner 728x90** code (highest-visibility slot) |
| 5 | IN-ARTICLE BANNER | watch.html | below the player | Second Adsterra **Banner** code |
| 6 | BOX 300x250 | watch.html | sidebar (desktop) / below player (mobile) | Adsterra **Banner 300x250** code |
| 7 | IN-FEED BANNER | index.html | between episode grid and footer | Second Adsterra **Banner** code |

### The "ads in between while the video plays" question — honest answer (also commented in watch.html)
Mid-roll ads INSIDE the YouTube iframe player are technically impossible — YouTube owns
the player and no page code can inject ads into it. Do not attempt overlay hacks; they get
blocked and can get the site penalized. The correct, policy-safe alternative is built in:
the **Social Bar** (slot 2) keeps floating ads appearing periodically while the video plays,
plus the banner slots around the player earn on every watch-page view.

## How Raj adds an episode (from his phone)

1. Upload the episode to YouTube as **UNLISTED** (plays only on this website, not public on his channel).
2. Open `https://<site>/admin`, log in (Netlify Identity — same as Leatherone).
3. Episodes → All Episodes → Add episode: fill **Full Episode Title** (always shown in full,
   never truncated), **Episode Number**, **YouTube Video ID** (only the ID part of the link),
   optional thumbnail (leave empty to auto-use the YouTube thumbnail), optional description.
4. Publish — the site rebuilds in ~1–2 minutes.

## Netlify setup (same as Leatherone)

- Option A (recommended, like Leatherone): push this folder to a GitHub repo, import in
  Netlify, then enable **Identity** and **Git Gateway** (Site settings → Identity) and
  invite Raj's email so /admin login works.
- Option B: drag-drop deploy works for viewing, but /admin publishing needs the Git-backed
  setup (Option A).
- The identity-widget script is already included on index.html and watch.html so invite
  emails land correctly.

## Things Raj must still do (not done in this scaffold)

1. **Real site URL**: replace `https://watchparty.netlify.app` in `sitemap.xml`, `robots.txt`,
   and `admin/config.yml` with the actual deployed URL.
2. **Contact email**: `contact.html` has `contact@watchparty.example.com` — replace with his real email.
3. **Sample episodes**: `episodes.json` has 3 clearly-marked SAMPLE episodes with fake YouTube
   IDs (`YOUTUBE_ID_SAMPLE_1/2/3`) — delete them in /admin and add real ones.
4. **Adsterra codes**: paste his own codes into the 7 labeled slots (see table above).
5. **Git branch**: `admin/config.yml` assumes the repo's default branch is `main`; change to
   `master` if his repo uses that.

## Verification (2026-10-19)

- `episodes.json` is valid JSON with all fields the JS expects
  (id, title, number, youtube_id, thumbnail, description).
- All HTML pages pass a tag-balance sanity check; no unclosed tags.
- Grid render logic verified against episodes.json (3 sample episodes, newest-first order).
- `watch.html` handles missing/invalid `?ep=` gracefully ("Episode not found" + back link).
- No name placeholder remains anywhere and no trace of the earlier "Full Episodes" name — the site name is "Watch Party" everywhere (titles, logo, footer, meta tags, admin config, sitemap).
- Full episode titles are never truncated: CSS has no ellipsis/nowrap on titles.
