const API_ROOT = "https://ws.audioscrobbler.com/2.0/";
const USER_AGENT = "ThiKeiW-NowPlaying-Worker/1.0 (+https://github.com/ThiKeiW)";
const MISSING_COVER = "2a96cbd8b46e442fc41c2b86b821562f.png";
const BASE_W = 360;
const BASE_H = 150;
const STYLES = `.sans{font-family:Inter,'Segoe UI',-apple-system,Helvetica,Arial,sans-serif}
.mono{font-family:ui-monospace,'SFMono-Regular',Consolas,'Liberation Mono',monospace}
.fg{fill:#e6edf3}.mu{fill:#7d8590}
@media (prefers-color-scheme: light){.fg{fill:#1f2328}.mu{fill:#59636e}}`;

export default {
  async fetch(request, env) {
    const params = new URL(request.url).searchParams;
    const user = strip(clean(params.get("user") || env.LASTFM_USER || "ThiKeiW", 64));
    const width = clamp(toInt(params.get("width"), 360), 100, 2000);
    const height = Math.round((width * BASE_H) / BASE_W);

    try {
      if (!env.LASTFM_API_KEY) throw new Error("Falta el secreto LASTFM_API_KEY");
      const track = await getTrack(user, env.LASTFM_API_KEY);
      const cover = await getCover(track.coverUrl);
      return svgResponse(renderTrack(track, cover, width, height));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      if (params.get("debug") === "1") {
        return new Response(JSON.stringify({ user, hasApiKey: Boolean(env.LASTFM_API_KEY), error: reason }, null, 2), {
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
      return svgResponse(renderFallback(width, height, reason));
    }
  },
};

function toInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clean(value, max) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);
}

function strip(value) {
  return value.replace(/[^\p{L}\p{N}\-_]/gu, "");
}

function readText(value) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") return readText(value["#text"] ?? value.name);
  return "";
}

function decodeEntities(value) {
  return String(value ?? "")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function esc(value) {
  return decodeEntities(clean(value, 200))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value, max) {
  const safe = esc(value);
  return safe.length > max ? `${safe.slice(0, max - 1).trimEnd()}…` : safe;
}

function isHttps(value) {
  return typeof value === "string" && value.startsWith("https://") && value.length < 2000;
}

async function getTrack(user, apiKey) {
  const query = new URLSearchParams({
    method: "user.getrecenttracks",
    user,
    api_key: apiKey,
    format: "json",
    limit: "1",
  });

  const response = await fetch(`${API_ROOT}?${query}`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!response.ok) throw new Error(`Last.fm respondió ${response.status}`);

  const data = await response.json();
  if (data?.error) throw new Error(`Last.fm ${data.error}: ${data.message ?? "sin mensaje"}`);

  const list = data?.recenttracks?.track;
  const item = Array.isArray(list) ? list[0] : list;
  if (!item) throw new Error("Ese usuario no tiene scrobbles");

  const images = Array.isArray(item.image) ? item.image : [];
  const coverUrl = [...images]
    .reverse()
    .map((image) => image?.["#text"])
    .find((url) => isHttps(url) && !url.includes(MISSING_COVER));

  return {
    title: clean(decodeEntities(readText(item.name)), 120),
    artist: clean(decodeEntities(readText(item.artist)), 120),
    nowPlaying: item?.["@attr"]?.nowplaying === "true",
    coverUrl: coverUrl ?? null,
  };
}

async function getCover(url) {
  if (!url) return null;

  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) return null;

  const mime = (response.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!/^image\/(jpeg|png|webp)$/.test(mime)) return null;

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength === 0 || buffer.byteLength > 1024 * 1024) return null;

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

function renderTrack(track, cover, width, height) {
  const label = track.nowPlaying ? "ESCUCHANDO AHORA" : "ÚLTIMA ESCUCHA";
  const labelColor = track.nowPlaying ? "#8FA866" : "#7d8590";
  const title = truncate(track.title, 27);
  const artist = truncate(track.artist, 25);

  const artwork = cover
    ? `<image href="${cover}" x="18" y="46" width="62" height="62" preserveAspectRatio="xMidYMid slice" clip-path="url(#coverClip)"/>`
    : `<rect x="18" y="46" width="62" height="62" rx="6" fill="#161b22" stroke="#30363d"/>
       <path d="M46 61v20a7 7 0 1 1-4-6.4V52l20-4v22a7 7 0 1 1-4-6.4V54z" fill="#6B8E3D"/>`;

  const bars = track.nowPlaying
    ? `<g fill="#6B8E3D"><rect x="311" y="132" width="3" height="8" rx="1.5"/><rect x="318" y="127" width="3" height="13" rx="1.5"/><rect x="325" y="130" width="3" height="10" rx="1.5"/><rect x="332" y="135" width="3" height="5" rx="1.5"/></g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${BASE_W} ${BASE_H}" role="img" aria-label="Last.fm: ${esc(track.artist)} - ${esc(track.title)}">
<style>${STYLES}</style>
<defs><clipPath id="coverClip"><rect x="18" y="46" width="62" height="62" rx="6"/></clipPath></defs>
<rect x="0.5" y="0.5" width="359" height="149" rx="10" fill="#0d1117" stroke="#2a313c"/>
<text class="mono" x="18" y="27" font-size="10" letter-spacing="1.2" fill="${labelColor}">${label}</text>
${artwork}
<text class="sans fg" x="94" y="72" font-size="14" font-weight="700">${title}</text>
<text class="sans mu" x="94" y="93" font-size="12">${artist}</text>
<line x1="18" y1="121" x2="342" y2="121" stroke="#21262d"/>
<circle cx="21" cy="136" r="2.6" fill="#6B8E3D"/>
<text class="mono mu" x="32" y="139" font-size="10">last.fm</text>
${bars}
</svg>`;
}

function renderFallback(width, height, reason) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${BASE_W} ${BASE_H}" role="img" aria-label="${esc(reason)}">
<style>${STYLES}</style>
<rect x="0.5" y="0.5" width="359" height="149" rx="10" fill="#0d1117" stroke="#2a313c"/>
<text class="mono" x="18" y="27" font-size="10" letter-spacing="1.2" fill="#7d8590">SIN MÚSICA POR AHORA</text>
<path d="M46 61v20a7 7 0 1 1-4-6.4V52l20-4v22a7 7 0 1 1-4-6.4V54z" fill="#6B8E3D"/>
<text class="sans fg" x="94" y="72" font-size="14" font-weight="700">Last.fm no disponible</text>
<text class="sans mu" x="94" y="93" font-size="12">${truncate(reason, 45)}</text>
<line x1="18" y1="121" x2="342" y2="121" stroke="#21262d"/>
<circle cx="21" cy="136" r="2.6" fill="#6B8E3D"/>
<text class="mono mu" x="32" y="139" font-size="10">last.fm</text>
</svg>`;
}

function svgResponse(svg) {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
