import fs from "fs";

import { Hyperbrowser } from "@hyperbrowser/sdk";
const API_KEY: string = process.env.HYPERBROWSER_API_KEY ?? "";

const client = new Hyperbrowser({
  apiKey: API_KEY,
});

const getPathname = (url: string) => {
  return new URL(url).pathname ?? "/";
};

export const generate_statics = async (outputPath: string) => {
  const crawlResult = await client.crawl.startAndWait({
    url: "https://www.docs.hyperbrowser.ai",
    maxPages: 100,
    ignoreSitemap: false,
    excludePatterns: [],
    includePatterns: [],
    sessionOptions: {
      acceptCookies: false,
      useStealth: false,
      useProxy: false,
      solveCaptchas: false,
    },
    scrapeOptions: {
      formats: ["markdown"],
      excludeTags: [],
      includeTags: [],
      onlyMainContent: true,
    },
  });
  //   fs.writeFileSync("crawlResult.json", JSON.stringify(crawlResult, null, 2));

  const uniqueUrls = Array.from(
    new Set(crawlResult.data?.map((item) => getPathname(item.url)))
  );

  const urlToDataMap = uniqueUrls.map((pathname) => {
    const matchingData = crawlResult.data?.find(
      (item) => getPathname(item.url) === pathname
    );
    return {
      pathname,
      data: matchingData,
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(urlToDataMap, null, 2));
};
