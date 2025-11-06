#!/bin/bash
# Remove Database Credentials from Git History
# WARNING: This rewrites git history. Use with caution!
# Only run this if credentials were actually committed.
#
# IMPORTANT: This script uses a SINGLE git-filter-repo call with multiple path patterns.
# This prevents issues with sequential calls that rewrite history multiple times.
# Each git-filter-repo call rewrites the entire git history, so multiple sequential
# calls can cause conflicts or incomplete filtering. All paths are combined into
# one atomic operation.

set -e

echo "=== Remove Credentials from Git History ==="
echo ""
echo "⚠️  WARNING: This script will rewrite git history!"
echo "⚠️  Make sure you have a backup and coordinate with your team!"
echo ""
read -p "Are you sure you want to proceed? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

# Check if git-filter-repo is available (preferred method)
if command -v git-filter-repo &> /dev/null; then
    echo ""
    echo "Using git-filter-repo (recommended)..."
    echo "Combining all path patterns into a single git-filter-repo call..."
    
    # Remove all sensitive files in a SINGLE git-filter-repo call
    # This prevents issues with sequential calls rewriting history multiple times
    git-filter-repo \
        --path postgres_connection.json \
        --path postgres_connection.json.local \
        --path-glob '*connection*.json' \
        --path-glob '*connection*.local' \
        --path test_db_connection.sh \
        --path mcp-backup.sh \
        --path mcp-restore.sh \
        --path setup-mcp-persistence.sh \
        --path canva-mcp-config.json \
        --path MCP-PERSISTENCE-GUIDE.md \
        --invert-paths \
        --force
    
    echo "✅ Credentials removed from history using git-filter-repo"
    
elif command -v git-filter-branch &> /dev/null; then
    echo ""
    echo "Using git-filter-branch (fallback)..."
    echo "⚠️  Note: git-filter-branch is deprecated. Consider installing git-filter-repo."
    
    # Remove all sensitive files from all branches and tags in a single call
    git filter-branch --force --index-filter \
        "git rm --cached --ignore-unmatch \
            postgres_connection.json \
            postgres_connection.json.local \
            '*connection*.json' \
            '*connection*.local' \
            test_db_connection.sh \
            mcp-backup.sh \
            mcp-restore.sh \
            setup-mcp-persistence.sh \
            canva-mcp-config.json \
            MCP-PERSISTENCE-GUIDE.md" \
        --prune-empty --tag-name-filter cat -- --all
    
    # Clean up
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    echo "✅ Credentials removed from history using git-filter-branch"
    echo "⚠️  Note: Clean up may take a while. Run 'git gc --aggressive' after."
    
else
    echo ""
    echo "❌ ERROR: Neither git-filter-repo nor git-filter-branch found"
    echo "Install git-filter-repo: brew install git-filter-repo"
    echo "Or install git-filter-branch (comes with git)"
    exit 1
fi

echo ""
echo "=== Next Steps ==="
echo "1. Verify removal:"
echo "   git log --all --full-history -- postgres_connection.json"
echo "   git log --all --full-history -- '*connection*.json'"
echo "   git log --all --full-history -- test_db_connection.sh"
echo "2. Force push to remote (coordinate with team first!):"
echo "   git push --force --all"
echo "   git push --force --tags"
echo "3. Have all team members re-clone the repository"
echo ""
echo "⚠️  IMPORTANT: After force pushing, all team members must:"
echo "   - Delete their local repository"
echo "   - Re-clone from remote"
echo "   - Or run: git fetch origin && git reset --hard origin/main"

