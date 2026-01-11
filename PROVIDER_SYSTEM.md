# AI Provider System

This workspace now supports a flexible, pluggable AI provider system that allows you to switch between different AI models and providers without changing any agent code.

## Supported Providers

### 1. **OpenAI** (Default)
- Models: `gpt-4o-mini` (default), `gpt-4o`, `gpt-4-turbo`
- Cost: Pay-per-use (GPT-4o mini is very affordable)
- Setup: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

```env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

### 2. **Anthropic (Claude)**
- Models: `claude-3-5-haiku`, `claude-3-5-sonnet`, `claude-3-opus`
- Cost: Pay-per-use
- Setup: Get API key from [Anthropic Console](https://console.anthropic.com/)

```env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-...
AI_MODEL=claude-3-5-haiku
```

### 3. **Ollama** (Local/Offline)
- Models: `mistral`, `llama2`, `neural-chat`, and many more
- Cost: Free (runs locally)
- Setup: [Download & install Ollama](https://ollama.ai)
- Notes: Requires Ollama running locally on `localhost:11434`

```env
AI_PROVIDER=ollama
AI_MODEL=mistral
AI_BASE_URL=http://localhost:11434
```

### 4. **GitHub Models** (Free Tier)
- Models: `gpt-4o-mini`, `gpt-4o`, `claude-3-5-haiku`, etc.
- Cost: Free tier available
- Setup: Get GitHub PAT token with model inference permissions
- Links: [GitHub Models Info](https://github.com/marketplace/models)

```env
AI_PROVIDER=github_models
AI_API_KEY=github_pat_...
AI_MODEL=gpt-4o-mini
```

## Quick Start

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Choose a Provider and Configure

#### Option A: Use OpenAI (default)
```env
AI_PROVIDER=openai
AI_API_KEY=sk-... # Your OpenAI API key
AI_MODEL=gpt-4o-mini
```

#### Option B: Use Anthropic Claude
```env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-... # Your Anthropic API key
AI_MODEL=claude-3-5-haiku
```

#### Option C: Use Local Ollama
```bash
# First, install and run Ollama
ollama pull mistral
ollama serve

# Then configure .env
AI_PROVIDER=ollama
AI_MODEL=mistral
AI_BASE_URL=http://localhost:11434
```

#### Option D: Use GitHub Models
```env
AI_PROVIDER=github_models
AI_API_KEY=github_pat_... # GitHub PAT token
AI_MODEL=gpt-4o-mini
```

### 3. Run Your Agents
```bash
npm run build
npm run start
```

## Architecture

The provider system uses the **Factory Pattern** for clean, extensible design:

```
AssistantAgent
    ↓ uses
ProviderFactory
    ├── creates → OpenAIProvider (implements IAIProvider)
    ├── creates → AnthropicProvider (implements IAIProvider)
    ├── creates → OllamaProvider (implements IAIProvider)
    └── creates → GitHubModelsProvider (implements IAIProvider)
```

### Key Files

- **`src/config/aiProviderConfig.ts`** - Configuration loader and enum
- **`src/agents/providers/iaIProvider.ts`** - Provider interface definition
- **`src/agents/providers/openaiProvider.ts`** - OpenAI implementation
- **`src/agents/providers/anthropicProvider.ts`** - Anthropic implementation
- **`src/agents/providers/ollamaProvider.ts`** - Ollama implementation
- **`src/agents/providers/githubModelsProvider.ts`** - GitHub Models implementation
- **`src/agents/providers/providerFactory.ts`** - Factory for instantiation
- **`src/agents/assistantAgent.ts`** - Base agent (now provider-agnostic)

## Configuration Options

All options are environment variables:

```env
# Provider selection (required)
AI_PROVIDER=openai|anthropic|ollama|github_models

# API credentials (required for OpenAI, Anthropic, GitHub Models; optional for Ollama)
AI_API_KEY=your_api_key_here

# Model selection (required)
AI_MODEL=gpt-4o-mini  # varies by provider

# Optional settings
AI_BASE_URL=          # Custom endpoint (useful for Ollama)
AI_TEMPERATURE=0.7    # Creativity level (0.0 - 2.0)
AI_MAX_TOKENS=2048    # Max response tokens
```

## Switching Providers

To switch providers, simply change the environment variables and restart:

```bash
# Switch from OpenAI to Claude
export AI_PROVIDER=anthropic
export AI_API_KEY=sk-ant-xxx
export AI_MODEL=claude-3-5-haiku

npm run start
```

**No code changes required!**

## Adding a New Provider

To add support for a new provider:

1. **Create provider file** - `src/agents/providers/yourProvider.ts`
2. **Implement IAIProvider interface**:
   ```typescript
   export class YourProvider implements IAIProvider {
     async complete(prompt: string, messages?: AIMessage[]): Promise<AIResponse>
     getName(): string
   }
   ```
3. **Add to factory** - Update `src/agents/providers/providerFactory.ts`
4. **Add to enum** - Update `src/config/aiProviderConfig.ts`

## Environment Variable Reference

| Variable | Example | Required | Provider |
|----------|---------|----------|----------|
| `AI_PROVIDER` | `openai` | Yes | All |
| `AI_API_KEY` | `sk-...` | Yes* | OpenAI, Anthropic, GitHub |
| `AI_MODEL` | `gpt-4o-mini` | Yes | All |
| `AI_BASE_URL` | `http://localhost:11434` | No | Ollama (default: localhost:11434) |
| `AI_TEMPERATURE` | `0.7` | No | All (default: 0.7) |
| `AI_MAX_TOKENS` | `2048` | No | All (default: 2048) |

*Not required for Ollama

## Cost Comparison

| Provider | Free Tier | Paid | Model | Cost per 1K input tokens |
|----------|-----------|------|-------|-------------------------|
| **Ollama** | ✅ Fully free | N/A | Mistral | Free (local) |
| **GitHub Models** | ✅ Generous free | Optional | GPT-4o mini | Free quota |
| **OpenAI** | ❌ No | ✅ Required | GPT-4o mini | $0.00015 |
| **Anthropic** | ❌ No | ✅ Required | Haiku | $0.00080 |

## Troubleshooting

### "API Key not found" Error
- Check that `AI_API_KEY` is set in `.env` file
- Ensure you have the correct key for the selected provider
- Run `echo $AI_API_KEY` to verify it's exported

### "Provider not recognized"
- Verify `AI_PROVIDER` value matches one of: `openai`, `anthropic`, `ollama`, `github_models`
- Check for typos (case-sensitive)

### Ollama Connection Failed
- Ensure Ollama is running: `ollama serve`
- Check that default model is installed: `ollama pull mistral`
- Verify `AI_BASE_URL` is set correctly (default: `http://localhost:11434`)

### Rate Limiting
- OpenAI: Check usage at [OpenAI Dashboard](https://platform.openai.com/account/usage/overview)
- Anthropic: Refer to [Anthropic docs](https://docs.anthropic.com/en/api/rate-limiting)
- GitHub: Check rate limits in GitHub settings

## Performance Tips

1. **Use Ollama locally** for fastest responses and zero latency
2. **Use GPT-4o mini** for cost-effective cloud AI
3. **Use Claude Haiku** for lower latency with Anthropic
4. **Batch requests** when possible to reduce API calls
5. **Cache responses** for repeated queries

## Example: Building a Multi-Model App

```typescript
import { AssistantAgent } from "./agents/assistantAgent";

// All these work with the same code - just change .env!
const agent1 = new AssistantAgent(); // Uses OpenAI by default
const agent2 = new AssistantAgent(); // Or Anthropic, Ollama, GitHub...

// AI selection is purely configuration-driven
const response = await agent1.ask("What is 2+2?");
console.log(response.message);
```

## References

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [GitHub Models](https://github.com/marketplace/models)

## Support

For issues with specific providers, refer to their official documentation. For issues with this system, open an issue on the repository.
