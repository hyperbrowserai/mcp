#!/bin/bash
# Enable Recommended MCP Servers
# Based on tech stack analysis and requirements

set -e

echo "=== Enabling Recommended MCP Servers ==="
echo ""

# Priority 1: Memory (you mentioned "rad memory")
echo "1. Enabling memory server..."
docker mcp server enable memory && echo "   ✅ Memory server enabled" || echo "   ⚠️  Memory server already enabled or error"

# Priority 2: Database Server (you have PostgreSQL)
echo ""
echo "2. Enabling database-server..."
docker mcp server enable database-server && echo "   ✅ Database server enabled" || echo "   ⚠️  Database server already enabled or error"

# Priority 3: GitHub Official
echo ""
echo "3. Enabling github-official..."
docker mcp server enable github-official && echo "   ✅ GitHub server enabled" || echo "   ⚠️  GitHub server already enabled or error"

# Priority 4: Task Orchestrator
echo ""
echo "4. Enabling task-orchestrator..."
docker mcp server enable task-orchestrator && echo "   ✅ Task orchestrator enabled" || echo "   ⚠️  Task orchestrator already enabled or error"

# Priority 5: Code Interpreter
echo ""
echo "5. Enabling mcp-code-interpreter..."
docker mcp server enable mcp-code-interpreter && echo "   ✅ Code interpreter enabled" || echo "   ⚠️  Code interpreter already enabled or error"

# Optional: Playwright (web automation)
echo ""
read -p "Enable Playwright (web automation)? (y/n): " ENABLE_PLAYWRIGHT
if [ "$ENABLE_PLAYWRIGHT" = "y" ] || [ "$ENABLE_PLAYWRIGHT" = "Y" ]; then
    docker mcp server enable playwright && echo "   ✅ Playwright enabled" || echo "   ⚠️  Playwright already enabled or error"
fi

# Optional: Perplexity Ask (search)
echo ""
read -p "Enable Perplexity Ask (AI search)? (y/n): " ENABLE_PERPLEXITY
if [ "$ENABLE_PERPLEXITY" = "y" ] || [ "$ENABLE_PERPLEXITY" = "Y" ]; then
    docker mcp server enable perplexity-ask && echo "   ✅ Perplexity enabled" || echo "   ⚠️  Perplexity already enabled or error"
fi

echo ""
echo "=== Summary ==="
echo "Enabled servers:"
docker mcp server ls 2>&1 | head -10

echo ""
echo "=== Next Steps ==="
echo "1. Check server configuration: docker mcp config read"
echo "2. Some servers may need API keys or tokens"
echo "3. Restart Cursor/your MCP client to see new servers"
echo ""
echo "Memory server tools available:"
docker mcp server inspect memory 2>&1 | grep -A 2 "\"name\"" | head -10

