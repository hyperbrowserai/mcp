import { CrawledPage } from "@hyperbrowser/sdk/types";
import fs from "fs";
import { OpenAI } from "openai";

type BasicSummary = {
  pathname: string;
  data: CrawledPage | undefined;
}[];

type Summary = {
  pathname: string;
  summary: string;
  data: CrawledPage | undefined;
};

const urlToDataMap: BasicSummary = JSON.parse(
  fs.readFileSync(process.argv[2], "utf8")
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarize = async (inputPath: string, outputPath: string) => {
  const summaries: Summary[] = [];
  const batchSize = 5;
  const totalBatches = Math.ceil(urlToDataMap.length / batchSize);

  for (let i = 0; i < urlToDataMap.length; i += batchSize) {
    const currentBatch = Math.floor(i / batchSize) + 1;
    console.log(`Processing batch ${currentBatch}/${totalBatches}...`);

    const batch = urlToDataMap.slice(i, i + batchSize);

    const batchPromises = batch.map(async (item) => {
      if (!item.data?.markdown) {
        return {
          pathname: item.pathname,
          summary: "No summary available",
          data: item.data,
        };
      }

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates brief summaries. The information is about Hyperbrowser, a tool for web scraping and automation, and contains information about the documentation of the tool. You should provide the summary so that it describes the topic of the page with respect to hyperbrowser and the content of the page.",
          },
          {
            role: "user",
            content: `Please summarize the following content in less than 20 words:\n\ntitle: ${item.data.metadata?.title}\n\n$markdown: {item.data.markdown}`,
          },
        ],
        model: "gpt-4o-mini",
      });

      return {
        pathname: item.pathname,
        data: item.data,
        summary: completion.choices[0]?.message?.content || "",
      };
    });

    const batchResults = await Promise.all(batchPromises);
    summaries.push(...batchResults);
  }

  console.log("Processing complete! Writing results to file...");
  fs.writeFileSync("summarized.json", JSON.stringify(summaries, null, 2));
  return summaries;
};
