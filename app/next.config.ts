import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Every internal href in this app comes straight from a WP `link` field
  // (or is built to match one, e.g. category pagination's `strana-N/`),
  // and those all end in `/`. Next's default strips trailing slashes and
  // redirects, so without this every internal link would round-trip
  // through a 308 - this makes the app's own URLs the canonical ones.
  trailingSlash: true,
  // Dev only: let phones/tablets on the local network load the dev server's
  // JS (Next blocks non-localhost origins by default, which leaves the page
  // un-hydrated - e.g. the mobile menu button does nothing).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
  async redirects() {
    return [
      // Školská rada is run by the town; its page lives on the town's site.
      { source: '/skolska-rada', destination: 'https://www.kostelecno.cz/skolska-rada', permanent: false },
      // Draft URLs of the history story, in case they were shared.
      { source: '/historie-:variant(1|2|3)', destination: '/historie/', permanent: true },
    ];
  },
};

export default withPayload(nextConfig);
