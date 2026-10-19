/* Watch Party — shared helpers (no build step, plain JS) */
'use strict';

async function loadEpisodes() {
  const res = await fetch('episodes.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('episodes.json could not be loaded (HTTP ' + res.status + ')');
  const data = await res.json();
  const eps = Array.isArray(data.episodes) ? data.episodes.slice() : [];
  // oldest -> newest by episode number
  eps.sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0));
  return eps;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isSampleId(ytid) {
  return /^YOUTUBE_ID_SAMPLE/i.test(String(ytid || ''));
}

// Thumbnail: uploaded image wins; sample episodes get a styled placeholder;
// real episodes fall back to the automatic YouTube thumbnail.
function thumbHtml(ep, cls) {
  const alt = esc(ep.title);
  if (ep.thumbnail) {
    return '<img src="' + esc(ep.thumbnail) + '" alt="' + alt + '" loading="lazy">';
  }
  if (isSampleId(ep.youtube_id)) {
    return '<div class="thumb-ph"><span>EP ' + esc(ep.number) + '</span></div>';
  }
  return '<img src="https://i.ytimg.com/vi/' + esc(ep.youtube_id) + '/hqdefault.jpg" alt="' + alt + '" loading="lazy" onerror="this.style.display=\'none\'">';
}

function watchUrl(ep) {
  return 'watch.html?ep=' + encodeURIComponent(ep.id);
}

function ytEmbedUrl(ytid) {
  return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(ytid) + '?rel=0';
}

function getParam(name) {
  try { return new URLSearchParams(window.location.search).get(name); }
  catch (e) { return null; }
}

// Render the Netflix-style episode grid into #episode-grid (newest first).
// Full episode titles are always rendered in full — CSS never truncates them.
async function renderGrid() {
  const grid = document.getElementById('episode-grid');
  const emptyNote = document.getElementById('episode-empty');
  if (!grid) return;
  try {
    const eps = await loadEpisodes();
    const list = eps.slice().reverse(); // newest first
    if (!list.length) {
      grid.innerHTML = '';
      if (emptyNote) emptyNote.style.display = 'block';
      return;
    }
    grid.innerHTML = list.map(function (ep) {
      return '' +
        '<a class="ep-card" href="' + watchUrl(ep) + '">' +
          '<div class="ep-thumb">' + thumbHtml(ep) +
            '<div class="play-badge"><i></i></div>' +
          '</div>' +
          '<div class="ep-info">' +
            '<div class="ep-num">Episode ' + esc(ep.number) + '</div>' +
            '<div class="ep-title">' + esc(ep.title) + '</div>' +
            (ep.description ? '<div class="ep-desc">' + esc(String(ep.description).slice(0, 120)) + (String(ep.description).length > 120 ? '…' : '') + '</div>' : '') +
            '<div class="watch-link">Watch Now</div>' +
          '</div>' +
        '</a>';
    }).join('');
    var count = document.getElementById('episode-count');
    if (count) count.textContent = list.length + (list.length === 1 ? ' Episode' : ' Episodes');
  } catch (err) {
    grid.innerHTML = '<div class="notfound" style="grid-column:1/-1"><h2>Could not load episodes</h2>' +
      '<p>episodes.json is missing or invalid. If you just deployed, wait a minute and refresh.</p></div>';
  }
}
