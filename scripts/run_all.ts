const GENERATE_STATIC_DATA_PATH = "static_data.json";
const SUMMARIZE_STATIC_DATA_PATH = "summarized.json";

import { generate_statics } from "./generate_statics";
import { summarize } from "./summarize_statics";

async function main() {
  console.log("Generating static data...");
  await generate_statics(GENERATE_STATIC_DATA_PATH);
  console.log("Summarizing static data...");
  await summarize(GENERATE_STATIC_DATA_PATH, SUMMARIZE_STATIC_DATA_PATH);
  console.log("Done");
}

main().catch((error) => console.error(error.message));
