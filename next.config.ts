import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.windermerecleaning.com",
          },
        ],
        destination: "https://windermerecleaning.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// Only for local `next dev` — do not run during CI / OpenNext production builds
// (remote bindings would otherwise hit Cloudflare edge-preview and fail the build).
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}
