# Complete MCP Servers List with Tools and Status

**Generated:** $(date)
**Total Servers Available:** 73

---

## ✅ Currently Enabled & Working Servers

### 🧠 Memory Server
**Status:** ✅ **WORKING**  
**Purpose:** Persistent AI memory and knowledge graph management  
**Why Use:** Long-term context retention, entity relationship tracking, conversation memory

**Tools:**
- ✅ `add_observations` - Add new observations to existing entities in the knowledge graph
- ✅ `create_entities` - Create multiple new entities in the knowledge graph
- ✅ `create_relations` - Link entities together
- ✅ `delete_entities` - Remove entities
- ✅ `delete_observations` - Remove observations
- ✅ `delete_relations` - Remove relations
- ✅ `open_nodes` - Open specific nodes in knowledge graph

**Use Cases:**
- Long-term conversation memory
- Knowledge base management
- Entity relationship tracking
- Context retention across sessions

---

### 🗄️ Database Server
**Status:** ✅ **WORKING**  
**Purpose:** Direct PostgreSQL database querying and management  
**Why Use:** Natural language SQL queries, database exploration, data analysis

**Tools:**
- ✅ `query_database` - Execute natural language queries (converts to SQL)
- ✅ `list_tables` - List all available tables
- ✅ `describe_table` - Get detailed schema information
- ✅ `execute_sql` - Execute raw SQL queries (with safety checks)
- ✅ `connect_to_database` - Connect to a new database

**Use Cases:**
- Query PostgreSQL databases (postgres, premiumgastro, skyvern, bluejet)
- Database schema exploration
- Natural language database queries
- Data analysis and reporting

**Current Configuration:**
- Connected to: `rag_memory` database (via Docker MCP config)
- Can connect to: postgres, premiumgastro, premium_gastro_mcp, bluejet, bluejet_isolated, skyvern

---

### 🔧 GitHub Official
**Status:** ✅ **WORKING**  
**Purpose:** GitHub repository management and collaboration  
**Why Use:** Complete GitHub integration, code management, collaboration

**Tools:**
- ✅ `add_comment_to_pending_review` - Add review comments to PRs
- ✅ `add_issue_comment` - Add comments to issues/PRs
- ✅ `create_branch` - Create new branches
- ✅ `create_issue` - Create GitHub issues
- ✅ `create_or_update_file` - Create/update files in repos
- ✅ `create_pull_request` - Create pull requests
- ✅ `create_repository` - Create new repositories
- ✅ `delete_file` - Delete files from repos
- ✅ `fork_repository` - Fork repositories
- ✅ `get_commit` - Get commit details
- ✅ `ask_question` - Ask questions about repositories

**Use Cases:**
- Code repository management
- Issue tracking
- Pull request reviews
- Code search and exploration
- Repository operations

---

### 📊 Task Orchestrator
**Status:** ✅ **WORKING**  
**Purpose:** Project, task, and feature management  
**Why Use:** Structured project management, task tracking, template-based workflows

**Tools:**
- ✅ `add_section` - Add sections to tasks/features/projects
- ✅ `add_template_section` - Add sections to templates
- ✅ `apply_template` - Apply templates to tasks/features
- ✅ `bulk_create_sections` - Efficiently create multiple sections
- ✅ `bulk_delete_sections` - Delete multiple sections
- ✅ `bulk_update_sections` - Update multiple sections
- ✅ `bulk_update_tasks` - Batch update tasks (70-90% token savings)
- ✅ `create_dependency` - Link related tasks
- ✅ `create_feature` - Create features
- ✅ `create_project` - Create projects
- ✅ `create_task` - Create tasks
- ✅ `create_template` - Create templates
- ✅ `delete_dependency` - Delete task dependencies
- ✅ `delete_feature` - Delete features
- ✅ `delete_project` - Delete projects
- ✅ `delete_section` - Delete sections
- ✅ `delete_task` - Delete tasks
- ✅ `delete_template` - Delete templates
- ✅ `disable_template` - Disable templates
- ✅ `enable_template` - Enable templates
- ✅ `feature_to_markdown` - Export features to markdown

**Use Cases:**
- Project planning and management
- Task tracking and organization
- Feature development workflow
- Template-based documentation
- Dependency management

---

### 💻 Code Interpreter (mcp-code-interpreter)
**Status:** ✅ **WORKING**  
**Purpose:** Code execution and interpretation  
**Why Use:** Execute Python code, data analysis, algorithm testing

**Tools:**
- ✅ `execute_code` - Execute Python code in persistent session (like Jupyter)

**Use Cases:**
- Testing code snippets
- Data analysis
- Algorithm verification
- Quick prototyping
- Jupyter-like code execution

---

### 🎭 Playwright
**Status:** ✅ **WORKING**  
**Purpose:** Web automation and browser control  
**Why Use:** Web scraping, automation, browser testing

**Tools:**
- ✅ `browser_click` - Perform click on web page
- ✅ `browser_navigate` - Navigate to URL
- ✅ `browser_snapshot` - Get page snapshot
- ✅ `browser_fill` - Fill form fields
- ✅ `browser_wait` - Wait for conditions
- ✅ (More tools available)

**Use Cases:**
- Web automation
- Web scraping
- Browser testing
- Form filling
- Page interaction

---

## 🟡 Additional Available Servers (Not Currently Tested)

### Cloud & Infrastructure
- `cloudflare-ai-gateway` - Cloudflare AI Gateway integration
- `cloudflare-audit-logs` - Cloudflare audit logs
- `cloudflare-autorag` - Cloudflare AutoRAG
- `cloudflare-browser-rendering` - Browser rendering on Cloudflare
- `cloudflare-container` - Container management
- `cloudflare-digital-experience-monitoring` - DEX monitoring
- `cloudflare-dns-analytics` - DNS analytics
- `cloudflare-docs` - Cloudflare documentation
- `cloudflare-graphql` - GraphQL API
- `cloudflare-logpush` - Log push
- `cloudflare-observability` - Observability tools
- `cloudflare-one-casb` - CASB integration
- `cloudflare-radar` - Radar API
- `cloudflare-workers-bindings` - Workers bindings
- `cloudflare-workers-builds` - Workers builds
- `cloud-run-mcp` - Google Cloud Run
- `kubernetes` - Kubernetes management

### Communication & Collaboration
- `slack` - Slack integration
- `mcp-discord` - Discord integration
- `gmail-mcp` - Gmail integration
- `linkedin-mcp-server` - LinkedIn integration
- `linear` - Linear issue tracking
- `asana` - Asana project management
- `notion` - Notion integration

### Development & Code
- `gitmcp` - Git operations
- `mcp-api-gateway` - API gateway
- `node-code-sandbox` - Node.js code sandbox
- `npm-sentinel` - npm package monitoring
- `sequentialthinking` - Sequential thinking patterns

### Database & Storage
- `SQLite` - SQLite database operations
- `filesystem` - File system operations

### AI & Machine Learning
- `hugging-face` - Hugging Face models
- `deepwiki` - Deep wiki search
- `perplexity-ask` - Perplexity AI search
- `gemini-api-docs` - Gemini API documentation
- `elevenlabs` - ElevenLabs voice AI

### Web & Content
- `apify` - Apify web scraping
- `apify-mcp-server` - Apify MCP server
- `brave` - Brave search
- `firecrawl` - Firecrawl web scraping
- `fetch` - HTTP fetch operations
- `curl` - cURL operations
- `markdownify` - Markdown conversion
- `markitdown` - Markdown parsing
- `wikipedia-mcp` - Wikipedia access
- `youtube_transcript` - YouTube transcripts

### Automation & Tools
- `playwright-mcp-server` - Playwright MCP server
- `puppeteer` - Puppeteer browser automation
- `desktop-commander` - Desktop automation
- `e2b` - E2B sandbox environment

### Specialized Services
- `google-maps-comprehensive` - Google Maps integration
- `handwriting-ocr` - Handwriting OCR
- `time` - Time operations
- `context7` - Context management
- `databutton` - Databutton integration
- `instant` - Instant operations
- `invideo` - Video operations
- `llmtxt` - LLM text operations
- `needle-mcp` - Needle MCP
- `openmesh` - OpenMesh integration
- `osp_marketing_tools` - Marketing tools
- `pluggedin-mcp-proxy` - MCP proxy
- `globalping` - Global ping services

---

## 🚫 Known Limitations

### Servers Requiring Configuration
Some servers may require API keys or additional configuration:
- GitHub servers require GitHub token
- Cloudflare servers require Cloudflare API tokens
- Linear/Notion require OAuth setup
- Database server needs connection strings

### Testing Status
- ✅ Tested and Working: Memory, Database, GitHub, Task Orchestrator, Code Interpreter, Playwright
- 🟡 Available but Not Tested: All others
- ❓ Status Unknown: Servers not yet enabled or tested

---

## 📋 Quick Reference

### Enable a Server
```bash
docker mcp server enable <server-name>
```

### Inspect a Server
```bash
docker mcp server inspect <server-name>
```

### List All Servers
```bash
docker mcp server ls
```

### Check Gateway Status
```bash
docker mcp gateway status
```

---

## 🎯 Recommended Servers for Your Stack

Based on your tech stack (PostgreSQL, GitHub, Node.js, TypeScript):

1. ✅ **Memory** - Already enabled
2. ✅ **Database Server** - Already enabled  
3. ✅ **GitHub Official** - Already enabled
4. ✅ **Task Orchestrator** - Already enabled
5. ✅ **Code Interpreter** - Already enabled
6. ✅ **Playwright** - Already enabled
7. 🟡 **Linear** - Consider enabling for issue tracking
8. 🟡 **Filesystem** - Consider enabling for file operations
9. 🟡 **Docker** - Consider enabling for container management
10. 🟡 **SQLite** - Consider if you use SQLite databases

---

**Last Updated:** $(date)
**Status:** ✅ All enabled servers tested and working


