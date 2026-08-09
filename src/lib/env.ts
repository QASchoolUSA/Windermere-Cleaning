import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Reads a variable from the Node environment, falling back to the Cloudflare
 * worker bindings when deployed. Secrets set with `wrangler secret put` only
 * appear on the worker env, not `process.env`.
 */
export function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;

  try {
    const { env } = getCloudflareContext();
    const fromWorker = env[name as keyof typeof env];
    if (typeof fromWorker === "string") return fromWorker;
  } catch {
    // Not running inside the Cloudflare worker (e.g. next dev).
  }

  return undefined;
}
