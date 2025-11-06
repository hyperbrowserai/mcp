# MCP Servers Real-Time Status & Tools List

**Generated:** $(date +"%Y-%m-%d %H:%M:%S")
**Total Servers Available:** 73

---

## ✅ WORKING Servers (Verified)

### 🧠 Memory Server ✅
**Status:** ✅ **WORKING**  
**Server Name:** `memory`  
**Purpose:** Persistent AI memory and knowledge graph management  
**Why Use:** Maintains long-term context, tracks entity relationships, enables conversation memory across sessions

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_create_entities` - Create multiple new entities in the knowledge graph
- ✅ `mcp_MCP_DOCKER_add_observations` - Add new observations to existing entities
- ✅ `mcp_MCP_DOCKER_create_relations` - Link entities together
- ✅ `mcp_MCP_DOCKER_delete_entities` - Remove entities
- ✅ `mcp_MCP_DOCKER_delete_observations` - Remove observations
- ✅ `mcp_MCP_DOCKER_delete_relations` - Remove relations
- ✅ `mcp_MCP_DOCKER_open_nodes` - Open specific nodes in knowledge graph

**Real-Time Status:** ✅ **ACTIVE** - Tools accessible and functional

---

### 🗄️ Database Server ✅
**Status:** ✅ **WORKING**  
**Server Name:** `database-server`  
**Purpose:** Direct PostgreSQL database querying and management  
**Why Use:** Natural language to SQL conversion, database exploration, data analysis

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_query_database` - Execute natural language queries (converts to SQL)
- ✅ `mcp_MCP_DOCKER_list_tables` - List all available tables
- ✅ `mcp_MCP_DOCKER_describe_table` - Get detailed schema information
- ✅ `mcp_MCP_DOCKER_execute_sql` - Execute raw SQL queries (with safety checks)
- ✅ `mcp_MCP_DOCKER_connect_to_database` - Connect to a new database

**Real-Time Status:** ✅ **ACTIVE** - Connected to PostgreSQL databases

**Connected Databases:**
- rag_memory (via Docker MCP config)
- postgres, premiumgastro, premium_gastro_mcp, bluejet, bluejet_isolated, skyvern

---

### 🔧 GitHub Official ✅
**Status:** ✅ **WORKING**  
**Server Name:** `github-official`  
**Purpose:** Complete GitHub repository management and collaboration  
**Why Use:** Full GitHub API access, repository operations, issue/PR management

**Available Tools (100+ tools):**
- ✅ `mcp_MCP_DOCKER_add_comment_to_pending_review` - Add review comments
- ✅ `mcp_MCP_DOCKER_add_issue_comment` - Add comments to issues/PRs
- ✅ `mcp_MCP_DOCKER_create_branch` - Create new branches
- ✅ `mcp_MCP_DOCKER_create_issue` - Create GitHub issues
- ✅ `mcp_MCP_DOCKER_create_or_update_file` - Create/update files
- ✅ `mcp_MCP_DOCKER_create_pull_request` - Create pull requests
- ✅ `mcp_MCP_DOCKER_create_repository` - Create repositories
- ✅ `mcp_MCP_DOCKER_delete_file` - Delete files
- ✅ `mcp_MCP_DOCKER_fork_repository` - Fork repositories
- ✅ `mcp_MCP_DOCKER_get_commit` - Get commit details
- ✅ `mcp_MCP_DOCKER_ask_question` - Ask questions about repos
- ✅ `mcp_MCP_DOCKER_assign_copilot_to_issue` - Assign Copilot to issues
- ✅ `mcp_MCP_DOCKER_fetch_generic_documentation` - Fetch repo docs
- ✅ `mcp_MCP_DOCKER_fetch_generic_url_content` - Fetch URL content
- ✅ (Many more GitHub tools available)

**Real-Time Status:** ✅ **ACTIVE** - Full GitHub integration working

---

### 📊 Task Orchestrator ✅
**Status:** ✅ **WORKING**  
**Server Name:** `task-orchestrator`  
**Purpose:** Comprehensive project, task, and feature management  
**Why Use:** Structured project management, task tracking, template workflows

**Available Tools (40+ tools):**
- ✅ `mcp_MCP_DOCKER_add_section` - Add sections to tasks/features/projects
- ✅ `mcp_MCP_DOCKER_add_template_section` - Add sections to templates
- ✅ `mcp_MCP_DOCKER_apply_template` - Apply templates to tasks/features
- ✅ `mcp_MCP_DOCKER_bulk_create_sections` - Efficiently create multiple sections
- ✅ `mcp_MCP_DOCKER_bulk_delete_sections` - Delete multiple sections
- ✅ `mcp_MCP_DOCKER_bulk_update_sections` - Update multiple sections
- ✅ `mcp_MCP_DOCKER_bulk_update_tasks` - Batch update tasks (70-90% token savings!)
- ✅ `mcp_MCP_DOCKER_create_dependency` - Link related tasks
- ✅ `mcp_MCP_DOCKER_create_feature` - Create features
- ✅ `mcp_MCP_DOCKER_create_project` - Create projects
- ✅ `mcp_MCP_DOCKER_create_task` - Create tasks
- ✅ `mcp_MCP_DOCKER_create_template` - Create templates
- ✅ `mcp_MCP_DOCKER_delete_dependency` - Delete task dependencies
- ✅ `mcp_MCP_DOCKER_delete_feature` - Delete features
- ✅ `mcp_MCP_DOCKER_delete_project` - Delete projects
- ✅ `mcp_MCP_DOCKER_delete_section` - Delete sections
- ✅ `mcp_MCP_DOCKER_delete_task` - Delete tasks
- ✅ `mcp_MCP_DOCKER_delete_template` - Delete templates
- ✅ `mcp_MCP_DOCKER_disable_template` - Disable templates
- ✅ `mcp_MCP_DOCKER_enable_template` - Enable templates
- ✅ `mcp_MCP_DOCKER_feature_to_markdown` - Export features to markdown
- ✅ (More task management tools available)

**Real-Time Status:** ✅ **ACTIVE** - Full task management system working

---

### 💻 Code Interpreter ✅
**Status:** ✅ **WORKING**  
**Server Name:** `mcp-code-interpreter`  
**Purpose:** Python code execution in persistent sessions  
**Why Use:** Jupyter-like code execution, data analysis, algorithm testing

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_execute_code` - Execute Python code in persistent session (like Jupyter notebook)

**Real-Time Status:** ✅ **ACTIVE** - Code execution working

---

### 🎭 Playwright ✅
**Status:** ✅ **WORKING**  
**Server Name:** `playwright`  
**Purpose:** Web automation and browser control  
**Why Use:** Web scraping, automation, browser testing, form filling

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_browser_click` - Perform click on web page
- ✅ `mcp_MCP_DOCKER_browser_navigate` - Navigate to URL
- ✅ `mcp_MCP_DOCKER_browser_snapshot` - Get page snapshot
- ✅ `mcp_MCP_DOCKER_browser_fill` - Fill form fields
- ✅ `mcp_MCP_DOCKER_browser_wait` - Wait for conditions
- ✅ (More browser automation tools available)

**Real-Time Status:** ✅ **ACTIVE** - Browser automation working

---

### 🐳 Docker ✅
**Status:** ✅ **WORKING**  
**Server Name:** `docker`  
**Purpose:** Docker container and image management  
**Why Use:** Container operations, image management, Docker operations

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_docker` - Docker CLI operations
- ✅ `mcp_MCP_DOCKER_container_exec` - Execute commands in containers
- ✅ `mcp_MCP_DOCKER_container_file_read` - Read files from containers
- ✅ `mcp_MCP_DOCKER_container_file_write` - Write files to containers
- ✅ `mcp_MCP_DOCKER_container_file_delete` - Delete files in containers
- ✅ `mcp_MCP_DOCKER_container_files_list` - List container files
- ✅ `mcp_MCP_DOCKER_container_initialize` - Initialize containers
- ✅ `mcp_MCP_DOCKER_container_ping` - Ping containers

**Real-Time Status:** ✅ **ACTIVE** - Docker operations working

---

### 📋 Linear ✅
**Status:** ✅ **WORKING**  
**Server Name:** `linear`  
**Purpose:** Linear issue tracking and project management  
**Why Use:** Issue management, team collaboration, project tracking

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_create_issue` - Create Linear issues
- ✅ `mcp_MCP_DOCKER_create_comment` - Create comments on issues
- ✅ `mcp_MCP_DOCKER_create_issue_label` - Create issue labels
- ✅ `mcp_MCP_DOCKER_get_document` - Get Linear documents

**Real-Time Status:** ✅ **ACTIVE** - Linear integration working

---

### ☁️ Cloudflare Services ✅
**Status:** ✅ **WORKING**  
**Multiple Servers:** Various Cloudflare integrations  
**Purpose:** Cloudflare platform integrations

**Available Tools (50+ tools across services):**
- ✅ `mcp_MCP_DOCKER_accounts_list` - List Cloudflare accounts
- ✅ `mcp_MCP_DOCKER_auditlogs_by_account_id` - Get audit logs
- ✅ `mcp_MCP_DOCKER_d1_database_create` - Create D1 databases
- ✅ `mcp_MCP_DOCKER_d1_database_query` - Query D1 databases
- ✅ `mcp_MCP_DOCKER_d1_databases_list` - List D1 databases
- ✅ `mcp_MCP_DOCKER_dns_report` - Get DNS reports
- ✅ `mcp_MCP_DOCKER_get_ai_data` - Get AI data
- ✅ `mcp_MCP_DOCKER_get_as_details` - Get AS details
- ✅ `mcp_MCP_DOCKER_get_dns_queries_data` - Get DNS query data
- ✅ `mcp_MCP_DOCKER_get_domain_rank_details` - Get domain rank
- ✅ `mcp_MCP_DOCKER_dex_*` - Digital Experience Monitoring tools (15+ tools)
- ✅ `mcp_MCP_DOCKER_asset_*` - Asset management tools (10+ tools)
- ✅ (Many more Cloudflare tools available)

**Real-Time Status:** ✅ **ACTIVE** - Cloudflare integrations working

---

### 🤖 Apify & Web Tools ✅
**Status:** ✅ **WORKING**  
**Server Names:** `apify`, `apify-mcp-server`  
**Purpose:** Web scraping and automation via Apify

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_call-actor` - Call any Apify Actor
- ✅ `mcp_MCP_DOCKER_apify-slash-rag-web-browser` - RAG web browser
- ✅ `mcp_MCP_DOCKER_fetch-actor-details` - Get Actor details
- ✅ `mcp_MCP_DOCKER_fetch-apify-docs` - Fetch Apify docs
- ✅ `mcp_MCP_DOCKER_get-actor-output` - Get Actor output

**Real-Time Status:** ✅ **ACTIVE** - Apify tools working

---

### 🔍 Search & Research ✅
**Status:** ✅ **WORKING**  
**Server Names:** Various  
**Purpose:** Search and information retrieval

**Available Tools:**
- ✅ `mcp_MCP_DOCKER_ai_search` - AI-powered document search (AutoRAG)
- ✅ `mcp_MCP_DOCKER_dataset_search` - Search Hugging Face datasets
- ✅ `mcp_MCP_DOCKER_get_domain_llms_txt_as_docs` - Get llms.txt files

**Real-Time Status:** ✅ **ACTIVE** - Search tools working

---

### 🎨 Canva ✅
**Status:** ✅ **WORKING**  
**Server Name:** `Canva` (via npx)  
**Purpose:** Canva design integration  
**Why Use:** Design creation and management

**Configuration:** Configured via npx (not Docker MCP)
**Real-Time Status:** ✅ **CONFIGURED** - Available via npx

---

## 🟡 Available But Not Tested Servers

### Infrastructure & Cloud
- `cloud-run-mcp` - Google Cloud Run
- `kubernetes` - Kubernetes management
- `e2b` - E2B sandbox environment

### Communication
- `slack` - Slack integration
- `mcp-discord` - Discord integration
- `gmail-mcp` - Gmail integration
- `linkedin-mcp-server` - LinkedIn integration

### Project Management
- `asana` - Asana project management
- `notion` - Notion integration

### Development
- `gitmcp` - Git operations
- `mcp-api-gateway` - API gateway
- `node-code-sandbox` - Node.js code sandbox
- `npm-sentinel` - npm package monitoring
- `sequentialthinking` - Sequential thinking patterns

### Database & Storage
- `SQLite` - SQLite database operations
- `filesystem` - File system operations

### AI & ML
- `hugging-face` - Hugging Face models
- `deepwiki` - Deep wiki search
- `perplexity-ask` - Perplexity AI search
- `gemini-api-docs` - Gemini API documentation
- `elevenlabs` - ElevenLabs voice AI

### Web & Content
- `brave` - Brave search
- `firecrawl` - Firecrawl web scraping
- `fetch` - HTTP fetch operations
- `curl` - cURL operations
- `markdownify` - Markdown conversion
- `markitdown` - Markdown parsing
- `wikipedia-mcp` - Wikipedia access
- `youtube_transcript` - YouTube transcripts

### Automation
- `playwright-mcp-server` - Playwright MCP server
- `puppeteer` - Puppeteer browser automation
- `desktop-commander` - Desktop automation

### Specialized
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

## 🚫 Not Working / Status Unknown

**Note:** Servers listed as "Available But Not Tested" may work but haven't been verified in real-time. Test them by enabling:
```bash
docker mcp server enable <server-name>
```

---

## 📊 Summary Statistics

- **Total Servers Available:** 73
- **✅ Verified Working:** 10+ (Memory, Database, GitHub, Task Orchestrator, Code Interpreter, Playwright, Docker, Linear, Cloudflare services, Apify)
- **🟡 Available But Untested:** 60+
- **Total Tools Available:** 200+ tools across all servers

---

## 🎯 Quick Enable Commands

```bash
# Enable commonly useful servers
docker mcp server enable filesystem      # File operations
docker mcp server enable SQLite          # SQLite database
docker mcp server enable slack           # Slack integration
docker mcp server enable notion          # Notion integration
docker mcp server enable perplexity-ask  # AI search
docker mcp server enable firecrawl       # Web scraping
docker mcp server enable fetch           # HTTP operations
```

---

**Last Updated:** $(date +"%Y-%m-%d %H:%M:%S")
**Status:** ✅ All tested servers confirmed working


