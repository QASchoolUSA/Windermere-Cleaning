// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { processBookingOutbox, type OutboxEnv } from "./src/lib/booking-outbox";

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);
    const proto =
      request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");

    // Permanent 301 canonical redirect for HTTP and WWW to canonical apex HTTPS
    if (proto === "http" || url.hostname === "www.windermerecleaning.com") {
      url.hostname = "windermerecleaning.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    return handler.fetch(request, env, ctx);
  },

  async scheduled(
    _controller: unknown,
    env: OutboxEnv,
    ctx: { waitUntil: (promise: Promise<unknown>) => void },
  ) {
    ctx.waitUntil(processBookingOutbox(env));
  },
};

// Required when using OpenNext DO queue / tag cache (harmless if unused).
// @ts-expect-error generated at build time
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";
