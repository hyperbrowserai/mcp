# Security Notice

## Database Credentials

**IMPORTANT:** Database connection credentials should NEVER be committed to version control.

### Files Excluded from Git

The following files containing sensitive information are excluded via `.gitignore`:
- `postgres_connection.json` and `*_connection.json` files
- `test_db_connection.sh` (contains hardcoded credentials)
- `.env` and `.env.local` files
- MCP configuration backups

### Using Environment Variables

Instead of hardcoding credentials, use environment variables:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in `.env` (this file is gitignored)

3. Load environment variables before running scripts:
   ```bash
   source .env
   # or
   export $(cat .env | xargs)
   ```

### Example Files

- `postgres_connection.json.example` - Template showing environment variable usage
- `.env.example` - Template for environment variables

### Verification

**Current Status:** ✅ **SECURE** - No credentials found in git history

Run verification script to check:
```bash
./verify-credentials-security.sh
```

This script checks:
- If `postgres_connection.json` was ever committed
- If connection files exist in git history
- If database usernames appear in history
- If database connection strings were committed
- If `.gitignore` is properly configured

### If Credentials Were Committed

If the verification script finds credentials in git history:

1. **Immediately rotate all exposed credentials**
   - Change database passwords
   - Update API keys
   - Revoke old credentials

2. **Remove from git history** (use with caution - rewrites history):
   ```bash
   ./remove-credentials-from-history.sh
   ```
   
   ⚠️ **WARNING:** This rewrites git history. Coordinate with your team!

3. **Force push** (after coordinating with team):
   ```bash
   git push --force --all
   git push --force --tags
   ```

4. **Team members must re-clone** or reset their local repositories

### Security Best Practices

1. ✅ Use environment variables for all credentials
2. ✅ Never commit `.env` files
3. ✅ Use `.example` files as templates
4. ✅ Run `verify-credentials-security.sh` before each commit
5. ✅ Rotate credentials if accidentally committed
6. ✅ Use secrets management in production (e.g., 1Password, AWS Secrets Manager)
7. ✅ Review `.gitignore` regularly to ensure sensitive files are excluded

