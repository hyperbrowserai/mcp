# HyperBrowser AI MCP Server

![Frame 5](https://github.com/user-attachments/assets/3309a367-e94b-418a-a047-1bf1ad549c0a)

An enhanced Model Context Protocol (MCP) Server for HyperBrowser with additional features including session file downloads. This server provides various tools to scrape, extract structured data, and crawl webpages. It also provides easy access to general purpose browser agents like OpenAI's CUA, Anthropic's Claude Computer Use, and Browser Use.

More information about HyperBrowser can be found [here](https://docs.hyperbrowser.ai/). The HyperBrowser API supports a superset of features present in the MCP server.

More information about the Model Context Protocol can be found [here](https://modelcontextprotocol.io/introduction).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tools](#tools)
- [Configuration](#configuration)
- [License](#license)

## Installation

### NPM Installation

Install globally:
```bash
npm install -g hyperbrowserai-mcp-server
```

Or run directly with npx:
```bash
npx hyperbrowserai-mcp-server
```

## Running on Cursor
Add to `~/.cursor/mcp.json` like this:
```json
{
  "mcpServers": {
    "hyperbrowserai": {
      "command": "npx",
      "args": ["-y", "hyperbrowserai-mcp-server"],
      "env": {
        "HYPERBROWSER_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

## Running on Windsurf
Add to your `./codeium/windsurf/model_config.json` like this:
```json
{
  "mcpServers": {
    "hyperbrowserai": {
      "command": "npx",
      "args": ["-y", "hyperbrowserai-mcp-server"],
      "env": {
        "HYPERBROWSER_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
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

## Claude Desktop App
This is an example config for the HyperBrowser AI MCP server for the Claude Desktop client.

```json
{
  "mcpServers": {
    "hyperbrowserai": {
      "command": "npx",
      "args": ["-y", "hyperbrowserai-mcp-server"],
      "env": {
        "HYPERBROWSER_API_KEY": "your-api-key"
      }
    }
  }
}
```


## Tools
* `scrape_webpage` - Extract formatted (markdown, screenshot etc) content from any webpage 
* `crawl_webpages` - Navigate through multiple linked pages and extract LLM-friendly formatted content
* `extract_structured_data` - Convert messy HTML into structured JSON
* `search_with_bing` - Query the web and get results with Bing search
* `browser_use_agent` - Fast, lightweight browser automation with the Browser Use agent
* `openai_computer_use_agent` - General-purpose automation using OpenAI’s CUA model
* `claude_computer_use_agent` - Complex browser tasks using Claude computer use
* `create_profile` - Creates a new persistent Hyperbrowser profile.
* `delete_profile` - Deletes an existing persistent Hyperbrowser profile.
* `list_profiles` - Lists existing persistent Hyperbrowser profiles.
* `get_session_downloads` - Retrieve files downloaded during a HyperBrowser session (requires saveDownloads: true in sessionOptions)

## Additional Features

This enhanced version includes:
- **Session Downloads**: Retrieve files downloaded during browser automation sessions
- **Cross-platform compatibility**: Improved Windows support
- **Enhanced documentation**: Comprehensive guides and examples

See [DOWNLOADS_FEATURE.md](./DOWNLOADS_FEATURE.md) for detailed information about the session downloads feature.

## Resources

The server provides the documentation about hyperbrowser through the `resources` methods. Any client which can do discovery over resources has access to it.

## License

This project is licensed under the MIT License.
