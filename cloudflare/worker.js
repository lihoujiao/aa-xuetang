// AA 学堂 static site served from Workers KV (binding: SITE).
// Files are the `next build` static export (out/), stored under keys like "/courses.html".
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    let path = decodeURIComponent(url.pathname);
    if (path.length > 1 && path.endsWith("/")) {
      return Response.redirect(url.origin + path.slice(0, -1) + url.search, 308);
    }
    const candidates = path === "/" ? ["/index.html"] : [path, path + ".html", path + "/index.html"];
    for (const key of candidates) {
      const { value, metadata } = await env.SITE.getWithMetadata(key, { type: "arrayBuffer", cacheTtl: 300 });
      if (value) return respond(value, metadata, key, 200, request);
    }
    const nf = await env.SITE.getWithMetadata("/404.html", { type: "arrayBuffer", cacheTtl: 300 });
    if (nf.value) return respond(nf.value, nf.metadata, "/404.html", 404, request);
    return new Response("Not Found", { status: 404 });
  },
};

function respond(body, metadata, key, status, request) {
  const headers = new Headers();
  headers.set("Content-Type", (metadata && metadata.ct) || "application/octet-stream");
  headers.set(
    "Cache-Control",
    key.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
  );
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(request.method === "HEAD" ? null : body, { status, headers });
}
