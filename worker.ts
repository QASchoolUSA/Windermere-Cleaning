// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { processBookingOutbox, type OutboxEnv } from "./lib/booking-outbox";

export default {
  fetch: handler.fetch,

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
