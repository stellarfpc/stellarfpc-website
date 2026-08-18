import { handleQuoteRequest } from "../functions/api/quote.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/quote") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "POST",
          },
        });
      }

      return handleQuoteRequest(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
