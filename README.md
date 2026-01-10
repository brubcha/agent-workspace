# My Agents Workspace

A workspace for AI Agent development using Microsoft Agent Framework.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

**Option 1: GitHub Models (Recommended for Getting Started)**

- Get a GitHub Personal Access Token (PAT) at https://github.com/settings/tokens
- Set `GITHUB_TOKEN` in `.env`
- Free tier available at https://models.github.ai/

**Option 2: Microsoft Foundry (for Production)**

- Set up an Azure AI Foundry project
- Add your endpoint and key to `.env`
- Supports all latest models with better production features

**Option 3: OpenAI**

- Add your OpenAI API key to `.env`

### 3. Create Your First Agent

```bash
npm run dev
```

## Project Structure

```
src/
  ├── agents/        # Agent implementations
  ├── tools/         # Tool definitions for agents
  ├── config/        # Configuration and setup
  └── index.ts       # Entry point
```

## Available Models

### GitHub Models (Free to Start)

- `openai/gpt-4o` - Most capable multimodal model
- `openai/gpt-4o-mini` - Affordable, efficient
- `meta/llama-3.3-70b-instruct` - Open source alternative
- `mistral-ai/mistral-large-2411` - Advanced reasoning

### Microsoft Foundry Models

- `gpt-5.1` - Logic-heavy, multi-step tasks
- `claude-opus-4-5` - Anthropic's most intelligent
- `claude-haiku-4-5` - Fast, cost-effective
- And many more...

See https://github.com/modelcontextprotocol for more details.

## Resources

- [Agent Framework Docs](https://github.com/microsoft/agent-framework)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub Models](https://models.github.ai)
- [Microsoft Foundry](https://ai.azure.com)

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Run
npm start
```

## License

MIT
