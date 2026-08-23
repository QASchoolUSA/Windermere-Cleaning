import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Only for local `next dev` — do not run during CI / OpenNext production builds
// (remote bindings would otherwise hit Cloudflare edge-preview and fail the build).
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}
