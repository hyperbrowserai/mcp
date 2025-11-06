# Enabled MCP Servers

## ✅ Successfully Enabled Servers

### 🧠 Memory Server
**Status:** ✅ Enabled  
**Purpose:** Persistent AI memory and knowledge graph management

**Available Tools:**
- `create_entities` - Create entities in knowledge graph
- `create_relations` - Link entities together  
- `add_observations` - Add facts/observations to entities
- `delete_entities` - Remove entities
- `delete_observations` - Remove observations
- `delete_relations` - Remove relations
- `open_nodes` - Open specific nodes in knowledge graph

**Use Cases:**
- Long-term conversation memory
- Knowledge base management
- Entity relationship tracking
- Context retention across sessions

### 🗄️ Database Server
**Status:** ✅ Enabled  
**Purpose:** Direct PostgreSQL database querying and management

**Available Tools:**
- `query_database` - Execute natural language queries (converts to SQL)
- `list_tables` - List all available tables
- `describe_table` - Get detailed schema information
- `execute_sql` - Execute raw SQL queries (with safety checks)
- `connect_to_database` - Connect to a new database

**Use Cases:**
- Query your PostgreSQL databases (postgres, premiumgastro, skyvern, bluejet)
- Database schema exploration
- Natural language database queries
- Data analysis and reporting

**Current Configuration:**
- Connected to: `rag_memory` database (via Docker MCP config)
- Can connect to: postgres, premiumgastro, premium_gastro_mcp, bluejet, bluejet_isolated, skyvern

### 🔧 GitHub Official
**Status:** ✅ Enabled  
**Purpose:** GitHub repository management and collaboration

**Available Tools:**
- Repository operations
- Issue management
- Pull request handling
- Code search
- Collaboration features

**Use Cases:**
- Code repository management
- Issue tracking
- Pull request reviews
- Code search and exploration

### 📊 Task Orchestrator
**Status:** ✅ Enabled  
**Purpose:** Project, task, and feature management

**Available Tools:**
- `create_task` - Create new tasks
- `create_feature` - Create features
- `create_project` - Create projects
- `add_section` - Add sections to tasks/features
- `bulk_create_sections` - Efficient section creation
- `bulk_update_tasks` - Batch task updates
- `create_dependency` - Link related tasks
- `apply_template` - Apply templates to tasks/features

**Use Cases:**
- Project planning and management
- Task tracking and organization
- Feature development workflow
- Template-based documentation

### 💻 Code Interpreter
**Status:** ✅ Enabled  
**Purpose:** Code execution and interpretation

**Available Tools:**
- Code snippet execution
- Algorithm testing
- Data analysis
- Programming language support

**Use Cases:**
- Testing code snippets
- Data analysis
- Algorithm verification
- Quick prototyping

## How to Use

### Accessing Servers
All enabled servers are accessible through:
1. **Docker MCP Gateway** - Automatically routes requests to enabled servers
2. **Cursor MCP Client** - Should automatically detect enabled servers
3. **MCP Tools** - Available as tools in your AI assistant

### Server Status
Check enabled servers:
```bash
docker mcp server ls
```

### Server Details
Inspect a specific server:
```bash
docker mcp server inspect memory
docker mcp server inspect database-server
docker mcp server inspect github-official
docker mcp server inspect task-orchestrator
docker mcp server inspect mcp-code-interpreter
```

### Configuration
View current configuration:
```bash
docker mcp config read
```

### Disable a Server
If needed:
```bash
docker mcp server disable <server-name>
```

## Next Steps

1. **Restart Cursor** - Restart Cursor to load new MCP servers
2. **Configure API Keys** - Some servers may need API keys (check `docker mcp config read`)
3. **Test Servers** - Try using the new tools in your AI assistant
4. **Explore Tools** - Check available tools for each server

## Additional Servers Available

Many more servers are available via Docker MCP. See `MCP-SERVERS-RECOMMENDATIONS.md` for complete list.

**Quick Enable More:**
```bash
docker mcp server enable playwright      # Web automation
docker mcp server enable perplexity-ask  # AI search
docker mcp server enable SQLite          # SQLite database
docker mcp server enable linear          # Linear issue tracking
docker mcp server enable notion          # Notion integration
```

## Troubleshooting

If servers don't appear:
1. Restart Cursor/your MCP client
2. Check Docker MCP gateway is running: `docker mcp gateway status`
3. Verify server is enabled: `docker mcp server inspect <server-name>`
4. Check logs in Docker Desktop MCP Toolkit section

