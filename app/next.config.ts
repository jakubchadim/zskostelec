import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Every internal href in this app comes straight from a WP `link` field
  // (or is built to match one, e.g. category pagination's `strana-N/`),
  // and those all end in `/`. Next's default strips trailing slashes and
  // redirects, so without this every internal link would round-trip
  // through a 308 - this makes the app's own URLs the canonical ones.
  trailingSlash: true,
  async redirects() {
    return [
      // Školská rada is run by the town; its page lives on the town's site.
      { source: '/skolska-rada', destination: 'https://www.kostelecno.cz/skolska-rada', permanent: false },
    ];
  },
};

export default nextConfig;
