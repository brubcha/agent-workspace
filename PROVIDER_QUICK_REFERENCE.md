# Quick Provider Switch Guide

## Copy-Paste Configuration Snippets

### OpenAI (Default)
```env
AI_PROVIDER=openai
AI_API_KEY=sk-proj-YOUR_KEY_HERE
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048
```
**Get API Key:** https://platform.openai.com/api-keys

---

### Claude (Anthropic)
```env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-YOUR_KEY_HERE
AI_MODEL=claude-3-5-haiku
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048
```
**Get API Key:** https://console.anthropic.com/

---

### Local Ollama
```env
AI_PROVIDER=ollama
AI_MODEL=mistral
AI_BASE_URL=http://localhost:11434
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048
```
**Setup Instructions:**
```bash
# 1. Install Ollama from https://ollama.ai
# 2. Start Ollama service
ollama serve

# 3. In another terminal, pull a model
ollama pull mistral
# or other models: llama2, neural-chat, etc.
```

---

### GitHub Models
```env
AI_PROVIDER=github_models
AI_API_KEY=github_pat_YOUR_TOKEN_HERE
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048
```
**Get API Key:** 
1. Go to https://github.com/settings/personal-access-tokens/new
2. Select "Models inference only" scope
3. Create token and copy it

---

## Terminal Shortcuts

### Switch to OpenAI
```bash
export AI_PROVIDER=openai
export AI_API_KEY=sk-...
export AI_MODEL=gpt-4o-mini
npm run build && npm run start
```

### Switch to Claude
```bash
export AI_PROVIDER=anthropic
export AI_API_KEY=sk-ant-...
export AI_MODEL=claude-3-5-haiku
npm run build && npm run start
```

### Switch to Ollama
```bash
export AI_PROVIDER=ollama
export AI_MODEL=mistral
export AI_BASE_URL=http://localhost:11434
npm run build && npm run start
```

### Switch to GitHub Models
```bash
export AI_PROVIDER=github_models
export AI_API_KEY=github_pat_...
export AI_MODEL=gpt-4o-mini
npm run build && npm run start
```

---

## Available Models by Provider

### OpenAI
- `gpt-4o-mini` ⭐ Default (fastest, cheapest)
- `gpt-4o` (more capable)
- `gpt-4-turbo` (specialized)

### Anthropic (Claude)
- `claude-3-5-haiku` ⭐ Fast & cheap
- `claude-3-5-sonnet` (balanced)
- `claude-3-opus` (most capable)

### Ollama (Local)
- `mistral` ⭐ Recommended (fast, good quality)
- `llama2` (popular, larger)
- `neural-chat` (optimized for chat)
- `orca-mini` (lightweight)
- And [100+ more models](https://ollama.ai/library)

### GitHub Models
- `gpt-4o-mini` ⭐ Recommended
- `gpt-4o`
- `claude-3-5-haiku`
- `claude-3-5-sonnet`
- `phi-4`
- `mistral-small`
- `jamba-1.5-mini`

---

## Cost Comparison (Per 1K Tokens)

| Provider | Model | Input Cost | Output Cost | Speed | Setup |
|----------|-------|-----------|-----------|-------|-------|
| **Ollama** | Mistral | FREE | FREE | ⚡⚡⚡ Fast | Run locally |
| **GitHub** | GPT-4o mini | FREE* | FREE* | ⚡⚡ Fast | GitHub PAT |
| **OpenAI** | GPT-4o mini | $0.00015 | $0.0006 | ⚡⚡ Fast | Credit card |
| **Anthropic** | Haiku | $0.0008 | $0.0024 | ⚡ Medium | Credit card |

*Free tier has generous quota, paid tier available

---

## Recommended Setups

### 🚀 **Production** → OpenAI GPT-4o mini
- Reliable, fast, affordable
- No local infrastructure needed
- Best for real-world applications

### 💡 **Development/Testing** → Ollama Mistral
- Free & fast
- Works offline
- No API keys needed
- Best for quick iteration

### 🧪 **Experimentation** → GitHub Models
- Free tier available
- Multiple model options
- Good for comparing models

### 🎯 **Quality First** → Anthropic Claude
- Excellent reasoning
- Best for complex tasks
- Good for specialized domains

---

## Troubleshooting Commands

```bash
# Check current provider config
cat .env | grep AI_

# Test OpenAI connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $AI_API_KEY"

# Test Ollama connection
curl http://localhost:11434/api/tags

# Rebuild and run
npm run clean && npm run build && npm run start

# View recent git changes
git log --oneline -5
```

---

## Need Help?

1. **Provider Documentation**
   - OpenAI: https://platform.openai.com/docs
   - Anthropic: https://docs.anthropic.com
   - Ollama: https://ollama.ai
   - GitHub: https://github.com/marketplace/models

2. **Full Provider Guide** → See `PROVIDER_SYSTEM.md`

3. **Configuration Help** → Check `.env.example`
