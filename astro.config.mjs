import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const site = isGitHubPages
  ? "https://vilo0411.github.io"
  : "https://valueinvesting.com.vn";
const base = isGitHubPages ? "/investing" : "/";

export default defineConfig({
  site,
  base,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/kien-thuc/") &&
        ![
          `${site}/co-phieu/`,
          `${site}/etf/`,
          `${site}/quy-dau-tu/`,
          `${site}/trai-phieu/`,
        ].includes(page) &&
        !page.includes("/preview/"),
    }),
  ],
  redirects: {
    "/co-phieu/": "/dau-tu/co-phieu/",
    "/etf/": "/dau-tu/etf/",
    "/quy-dau-tu/": "/dau-tu/etf/",
    "/dau-tu/quy-dau-tu/": "/dau-tu/etf/",
    "/trai-phieu/": "/dau-tu/trai-phieu/",
    "/phai-sinh/": "/dau-tu/phai-sinh/",
  },
});
