# Security Checklist

## ✅ Pre-Commit Security Check

Before pushing to GitHub, ensure:

### 1. No API Keys in Code
```bash
# Check for hardcoded API keys
grep -r "AIzaSy\|arc_o15kGL" --exclude-dir=node_modules --exclude=".env" .
# Should return: "No API keys found in tracked files"
```

### 2. Environment File is Ignored
```bash
# Verify .env is ignored by git
git check-ignore .env
# Should return: ".env"
```

### 3. Only Placeholder Values in Code
- ✅ `config/env.js`: Uses `your_gemini_api_key_here` and `your_arcade_api_key_here`
- ✅ `app.config.js`: Uses `process.env.GEMINI_API_KEY` and `process.env.ARCADE_API_KEY`
- ✅ `config/env.example`: Contains example placeholders

### 4. .gitignore is Complete
```bash
# Check .gitignore includes environment files
grep -E "\.env" .gitignore
# Should show: .env*.local, .env
```

## 🔒 Security Best Practices

### API Key Management
- **Never hardcode** API keys in source code
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** for security
- **Use different keys** for development and production

### Environment Variables
- **Local development**: Use `.env` file (ignored by git)
- **Production**: Set environment variables in deployment platform
- **Team sharing**: Use `config/env.example` with placeholders

### Code Review Checklist
Before merging any PR:
- [ ] No API keys in code
- [ ] No secrets in comments
- [ ] Environment variables used correctly
- [ ] `.env` file not committed
- [ ] Placeholder values in examples only

## 🚨 If You Accidentally Commit API Keys

### Immediate Actions
1. **Revoke the exposed keys** immediately
2. **Generate new API keys** from the respective services
3. **Update your local `.env` file** with new keys
4. **Remove keys from git history** (if possible)

### Remove from Git History
```bash
# Remove sensitive files from git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push to update remote
git push origin --force --all
```

### Prevention
- **Use pre-commit hooks** to check for secrets
- **Regular security audits** of the codebase
- **Team training** on security best practices
- **Automated scanning** tools in CI/CD

## 📋 Security Audit Commands

### Check for Secrets
```bash
# Search for common API key patterns
grep -r -E "(sk-|pk_|AIza|arc_|ghp_|gho_)" --exclude-dir=node_modules --exclude=".env" .

# Check for hardcoded URLs with keys
grep -r "api.*key.*=" --exclude-dir=node_modules --exclude=".env" .

# Look for environment variable assignments
grep -r "=.*[A-Za-z0-9]{20,}" --exclude-dir=node_modules --exclude=".env" .
```

### Verify Git Status
```bash
# Check what's being committed
git status

# Review staged changes
git diff --cached

# Check for sensitive files
git ls-files | grep -E "\.(env|key|secret)"
```

## 🔐 Production Security

### Environment Variables
- **Use secure secret management** (AWS Secrets Manager, Azure Key Vault, etc.)
- **Never log environment variables**
- **Use different keys** for different environments
- **Monitor API key usage** for anomalies

### API Key Security
- **Set usage limits** on API keys
- **Monitor API usage** regularly
- **Implement rate limiting** in your app
- **Use HTTPS** for all API calls

### Code Security
- **Regular dependency updates**
- **Security scanning** in CI/CD
- **Code review** for all changes
- **Automated security testing**

---

**Remember**: Security is everyone's responsibility. When in doubt, ask for a security review before committing sensitive changes.
