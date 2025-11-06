#!/bin/bash
# Security Verification Script
# Checks if sensitive files are in git history or staged for commit

echo "=== SECURITY VERIFICATION ==="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SENSITIVE_FILES=(
  "mcp-backup.sh"
  "mcp-restore.sh"
  "setup-mcp-persistence.sh"
  "canva-mcp-config.json"
  "MCP-PERSISTENCE-GUIDE.md"
  "postgres_connection.json"
  "postgres_connection.json.local"
  "test_db_connection.sh"
)

ISSUES_FOUND=0

echo "1. Checking git history..."
HISTORY_MATCHES=$(git log --all --full-history --name-only --pretty=format: -- "${SENSITIVE_FILES[@]}" 2>/dev/null | sort -u | grep -v '^$')
if [ -z "$HISTORY_MATCHES" ]; then
  echo -e "${GREEN}✅ No sensitive files found in git history${NC}"
else
  echo -e "${RED}❌ ISSUE: Sensitive files found in git history:${NC}"
  echo "$HISTORY_MATCHES"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "2. Checking tracked files..."
TRACKED=$(git ls-files | grep -E "(mcp-backup|mcp-restore|setup-mcp-persistence|canva-mcp-config|MCP-PERSISTENCE|postgres_connection|test_db_connection)" || true)
if [ -z "$TRACKED" ]; then
  echo -e "${GREEN}✅ No sensitive files are tracked by git${NC}"
else
  echo -e "${RED}❌ ISSUE: Sensitive files are tracked:${NC}"
  echo "$TRACKED"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "3. Checking staged files..."
STAGED=$(git diff --cached --name-only | grep -E "(mcp-backup|mcp-restore|setup-mcp-persistence|canva-mcp-config|MCP-PERSISTENCE|postgres_connection|test_db_connection)" || true)
if [ -z "$STAGED" ]; then
  echo -e "${GREEN}✅ No sensitive files are staged for commit${NC}"
else
  echo -e "${RED}❌ ISSUE: Sensitive files are staged for commit:${NC}"
  echo "$STAGED"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "4. Checking .gitignore..."
if grep -q "postgres_connection.json" .gitignore && grep -q "mcp-backup.sh" .gitignore; then
  echo -e "${GREEN}✅ Sensitive files are listed in .gitignore${NC}"
else
  echo -e "${YELLOW}⚠️  Warning: Some sensitive files may not be in .gitignore${NC}"
fi

echo ""
echo "=== SUMMARY ==="
if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ NO SECURITY ISSUES FOUND${NC}"
  echo "All sensitive files are properly excluded from git."
  exit 0
else
  echo -e "${RED}❌ $ISSUES_FOUND ISSUE(S) FOUND${NC}"
  echo "Please review and fix the issues above before committing."
  exit 1
fi

