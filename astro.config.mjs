import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://valueinvesting.com.vn",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/kien-thuc/") &&
        ![
          "https://valueinvesting.com.vn/co-phieu/",
          "https://valueinvesting.com.vn/etf/",
          "https://valueinvesting.com.vn/quy-dau-tu/",
          "https://valueinvesting.com.vn/trai-phieu/",
        ].includes(page),
    }),
  ],
  redirects: {
    "/co-phieu/": "/dau-tu/co-phieu/",
    "/etf/": "/dau-tu/etf/",
    "/quy-dau-tu/": "/dau-tu/quy-dau-tu/",
    "/trai-phieu/": "/dau-tu/trai-phieu/",
    "/phai-sinh/": "/dau-tu/phai-sinh/",
  },
});
