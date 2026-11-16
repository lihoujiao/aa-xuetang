const TYPES = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  map: "application/json; charset=utf-8",
  webmanifest: "application/manifest+json",
};

const BINARY = new Set(["png", "jpg", "jpeg", "webp", "gif", "ico", "woff", "woff2"]);

function extname(key) {
  const base = key.split("/").pop() || "";
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
}

function lookupKeys(pathname) {
  if (pathname === "/") return ["/", "/index.html"];
  const keys = [pathname];
  if (!pathname.endsWith("/")) {
    keys.push(`${pathname}.html`, `${pathname}/index.html`);
  } else {
    keys.push(`${pathname}index.html`);
  }
  return keys;
}

export async function serveStatic(request, env) {
  const url = new URL(request.url);
  let pathname = url.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  if (pathname.includes("..")) return new Response("Bad Request", { status: 400 });

  for (const key of lookupKeys(pathname)) {
    const hit = await readKey(env, key);
    if (hit) return new Response(hit.body, { status: 200, headers: hit.headers });
  }
  const missing = await readKey(env, "/404.html");
  if (missing) return new Response(missing.body, { status: 404, headers: missing.headers });
  return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
}

async function readKey(env, key) {
  if (!env.SITE) return null;
  const ext = extname(key);
  const binary = BINARY.has(ext);
  const body = await env.SITE.get(key, binary ? { type: "arrayBuffer" } : { type: "text" });
  if (body == null) return null;
  const headers = new Headers({
    "content-type": TYPES[ext] || "application/octet-stream",
  });
  if (key.startsWith("/_next/static/")) {
    headers.set("cache-control", "public, max-age=31536000, immutable");
  }
  return { body, headers };
}
