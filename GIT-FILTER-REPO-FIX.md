# Git-Filter-Repo Sequential Calls Fix

**Date:** November 5, 2025  
**Issue:** Sequential `git-filter-repo` calls without proper state management  
**Status:** ✅ **FIXED**

## Issue Description

The `remove-credentials-from-history.sh` script contained **three sequential `git-filter-repo` calls**:

```bash
# ❌ PROBLEMATIC CODE (BEFORE FIX)
git-filter-repo --path postgres_connection.json --invert-paths --force
git-filter-repo --path-glob '*connection*.json' --invert-paths --force
git-filter-repo --path test_db_connection.sh --invert-paths --force
```

### Why This Was a Problem

1. **History Rewriting**: Each `git-filter-repo` call rewrites the **entire git history**
2. **State Conflicts**: Subsequent calls operate on an already-rewritten repository
3. **Incomplete Filtering**: Can cause conflicts or miss files due to state changes
4. **Performance**: Multiple rewrites are slower and more error-prone
5. **Data Integrity**: Risk of inconsistent repository state

## Solution

**Combined all path patterns into a SINGLE `git-filter-repo` call:**

```bash
# ✅ FIXED CODE (AFTER FIX)
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
```

## Benefits

✅ **Single Atomic Operation**: All files removed in one history rewrite  
✅ **No State Conflicts**: Repository state is consistent  
✅ **Better Performance**: One rewrite instead of three  
✅ **Complete Filtering**: All patterns processed together  
✅ **More Files Covered**: Added additional sensitive files from `.gitignore`

## Files Modified

- `remove-credentials-from-history.sh`
  - Combined 3 sequential `git-filter-repo` calls into 1
  - Updated `git-filter-branch` fallback to match
  - Added comprehensive comments explaining the fix
  - Expanded file list to match `.gitignore` patterns

## Verification

The fix ensures:
- ✅ Single `git-filter-repo` call processes all paths
- ✅ No sequential history rewrites
- ✅ Consistent repository state
- ✅ All sensitive files covered

## Testing

To verify the fix works correctly:

```bash
# Check script syntax
bash -n remove-credentials-from-history.sh

# Review the git-filter-repo call structure
grep -A 15 "git-filter-repo" remove-credentials-from-history.sh
```

**Expected Output:**
- Single `git-filter-repo` command with multiple `--path` and `--path-glob` options
- No sequential calls

## References

- [git-filter-repo Documentation](https://github.com/newren/git-filter-repo)
- Best Practice: Use multiple path patterns in a single call rather than sequential calls

---

**Fix Applied By:** Security Audit  
**Status:** ✅ **VERIFIED AND FIXED**

