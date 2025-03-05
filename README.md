# Hyperbrowser MCP Server

This project is a server implementation for the Hyperbrowser using the Model Context Protocol (MCP). The server provides various tools to scrape, extract structured data, and crawl webpages.

More information about the Hyperbrowser can be found [here](https://docs.hyperbrowser.ai/). The hyperbrowser API supports a superset of features present in the mcp server.

More information about the Model Context Protocol can be found [here](https://modelcontextprotocol.io/introduction).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Example config](#example-config)
- [Tools](#tools)
  - [Scrape Webpage](#scrape-webpage)
  - [Extract Structured Data](#extract-structured-data)
  - [Crawl Webpages](#crawl-webpages)
- [Configuration](#configuration)
- [License](#license)

## Installation

To install the server, run:

```bash
npx hyperbrowser-mcp
```

### Development

For development purposes, you can run the server directly from the source code.

1. Clone the repository:

   ```sh
   git clone git@github.com:hyperbrowserai/mcp.git hyperbrowser-mcp
   cd hyperbrowser-mcp
   ```

2. Install dependencies:
   ```sh
   npm install # or yarn install
   npm run build
   ```

3. Run the server:

   ```sh
   node dist/server.js
   ```

### Example config

This is an example config for the Hyperbrowser MCP server for the Claude Desktop client.

```json
{
  "mcpServers": {
    "hyperbrowser": {
      "command": "npx",
      "args": ["hyperbrowser-mcp"],
      "env": {
        "HB_API_KEY": "your-api-key" // or set the environment variable in the prompt itself
      }
    }
  }
}
```

Other client (such as Cursor) do not support the `env` field in the config or as a part of the command param. In that case, you can use a shell script to run the server with the correct environment variable. An example shell script is provided in the repository as `run_server.sh`.

```json
{
  "mcpServers": {
    "hyperbrowser": {
      "command": "bash",
      "args": ["/path/to/hyperbrowser-mcp/run_server.sh"]
    }
  }
}
```

If for some reason you can't provide the API key in the config or in a shell script, you can set it within whatever prompt you are using. It will be upto the mcp client to pass it to the server.

## Tools

### Scrape Webpage

This tool allows you to scrape a webpage and retrieve content in various formats such as markdown, HTML, links, and screenshots.

#### Parameters:

- `url`: The URL of the webpage to scrape.
- `apiKey`: (Optional) The API key to use for the scrape.
- `sessionOptions`: (Optional) Options for the browser session.
- `outputFormat`: The format of the output (from a list of markdown, html, links, screenshot).

### Extract Structured Data

This tool extracts structured information from a list of webpages using a specified prompt and JSON schema.

#### Parameters:

- `urls`: The list of URLs of the webpages to extract structured information from.
- `apiKey`: (Optional) The API key to use for the extraction.
- `sessionOptions`: (Optional) Options for the browser session.
- `prompt`: (Optional - if not provided, the tool will try to infer the prompt from the schema) The prompt to use for the extraction.
- `schema`: (Optional - if not provided, the tool will try to infer the schema from the prompt) The JSON schema to use for the extraction.

### Crawl Webpages

This tool crawls a list of webpages, optionally following links and limiting the number of pages.

#### Parameters:

- `url`: The URL of the webpage to crawl.
- `apiKey`: (Optional) The API key to use for the crawl.
- `sessionOptions`: (Optional) Options for the browser session.
- `outputFormat`: The format of the output (from a list of markdown, html, links, screenshot).
- `followLinks`: Whether to follow links on the crawled webpages.
- `maxPages`: The maximum number of pages to crawl.

### Session Options

The `sessionOptions` parameter allows you to configure various aspects of the browser session. It is an optional parameter and can include the following fields:

- `useProxy`: (Optional) Whether to use a proxy.
- `useStealth`: (Optional) Whether to use stealth mode.
- `solveCaptchas`: (Optional) Whether to solve captchas.
- `acceptCookies`: (Optional) Whether to automatically close the accept cookies popup.

These options help in customizing the behavior of the browser session to suit your specific needs.

## Configuration

The server can be configured using environment variables or by modifying the source code directly. Ensure that the `HB_API_KEY` environment variable is set if you are not providing an API key directly in the requests.

## License

This project is licensed under the MIT License.
