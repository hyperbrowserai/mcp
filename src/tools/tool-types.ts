import { z } from "zod";
import { Ajv } from "ajv";

const ajv = new Ajv({
    coerceTypes: true,
    useDefaults: true,
});

export const sessionOptionsSchema = z
    .object({
        useProxy: z.boolean().default(false).describe("Whether to use a proxy. Recommended true."),
        useStealth: z
            .boolean()
            .default(false)
            .describe("Whether to use stealth mode. Recommended false."),
        solveCaptchas: z
            .boolean()
            .default(false)
            .describe("Whether to solve captchas. Recommended false."),
        acceptCookies: z
            .boolean()
            .default(false)
            .describe("Whether to automatically close the accept cookies popup. Recommended false."),
    })
    .optional()
    .describe(
        "Options for the browser session. Avoid setting these if not mentioned explicitly"
    );

export const apiKeySchema = z
    .string()
    .optional()
    .describe("The API key to use for the scrape");

// Scrape Webpage

export const scrapeWebpageToolParamSchemaRaw = ({
    url: z.string().url().describe("The URL of the webpage to scrape"),
    apiKey: apiKeySchema,
    sessionOptions: sessionOptionsSchema,
    outputFormat: z
        .array(z.enum(["markdown", "html", "links", "screenshot"]))
        .min(1)
        .describe("The format of the output"),
});

export const scrapeWebpageToolParamSchema = z.object(scrapeWebpageToolParamSchemaRaw);

export type scrapeWebpageToolParamSchemaType = z.infer<typeof scrapeWebpageToolParamSchema>

// Extract Structured Data

export const extractStructuredDataToolParamSchemaRaw = ({
    urls: z
        .array(z.string().url())
        .describe(
            "The list of URLs of the webpages to extract structured information from. Can include wildcards (e.g. https://example.com/*)"
        ),
    apiKey: apiKeySchema,
    prompt: z.string().describe("The prompt to use for the extraction"),
    schema: z
        .any({})
        .transform((schema) => {
            if (!schema) {
                return false;
            } else {
                try {
                    if (typeof schema === "string") {
                        try {
                            const parsedSchema = JSON.parse(schema);
                            const validate = ajv.compile(parsedSchema);
                            if (typeof validate === "function") {
                                return parsedSchema;
                            } else {
                                return undefined;
                            }
                        } catch (err) {
                            return undefined;
                        }
                    } else {
                        const validate = ajv.compile(schema);
                        if (typeof validate === "function") {
                            return schema;
                        } else {
                            return undefined;
                        }
                    }
                } catch (err) {
                    return false;
                }
            }
        })
        .describe(
            "The json schema to use for the extraction. Must provide an object describing a spec compliant json schema, any other types are invalid."
        ),
    sessionOptions: sessionOptionsSchema,
});

export const extractStructuredDataToolParamSchema = z.object(extractStructuredDataToolParamSchemaRaw);

export type extractStructuredDataToolParamSchemaType = z.infer<typeof extractStructuredDataToolParamSchema>;

// Crawl Webpages

export const crawlWebpagesToolParamSchemaRaw = ({
    url: z.string().url().describe("The URL of the webpage to crawl."),
    apiKey: apiKeySchema,
    sessionOptions: sessionOptionsSchema,
    outputFormat: z
        .array(z.enum(["markdown", "html", "links", "screenshot"]))
        .min(1)
        .describe("The format of the output"),
    followLinks: z
        .boolean()
        .describe("Whether to follow links on the crawled webpages"),
    maxPages: z
        .number()
        .int()
        .positive()
        .finite()
        .safe()
        .min(1)
        .max(1000)
        .default(10),
    ignoreSitemap: z.boolean().default(false),
});

export const crawlWebpagesToolParamSchema = z.object(crawlWebpagesToolParamSchemaRaw);

export type crawlWebpagesToolParamSchemaType = z.infer<typeof crawlWebpagesToolParamSchema>;

// Browser Use

export const browserUseToolParamSchemaRaw = ({
    task: z.string().describe("The task to perform inside the browser"),
    apiKey: apiKeySchema,
    sessionOptions: sessionOptionsSchema,
    maxSteps: z
        .number()
        .int()
        .positive()
        .finite()
        .safe()
        .min(1)
        .max(1000)
        .default(10),
});

export const browserUseToolParamSchema = z.object(browserUseToolParamSchemaRaw);

export type browserUseToolParamSchemaType = z.infer<typeof browserUseToolParamSchema>;
