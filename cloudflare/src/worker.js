import { handleApi } from "./api.js";
import { serveStatic } from "./static.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }
    return serveStatic(request, env);
  },
};
