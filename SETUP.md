# Agent Development Workspace - Setup Guide

## What's Been Created

This workspace is configured for AI Agent development using:

- **Microsoft Agent Framework** - For building and orchestrating agents
- **TypeScript** - For type-safe development
- **Model Support** - GitHub Models, Microsoft Foundry, or OpenAI

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Choose Your Model Provider

**Option A: GitHub Models (Recommended for Getting Started)**

- Free to start, no credit card required
- Models available: GPT-4o, GPT-4o Mini, Llama 3.3, etc.
- Steps:
  1. Create GitHub PAT: https://github.com/settings/tokens
  2. Copy `.env.example` to `.env`
  3. Add your token: `GITHUB_TOKEN=your_token_here`
  4. Run: `npm run dev`

**Option B: Microsoft Foundry (For Production)**

- More models and better production support
- Requires Azure subscription
- Set endpoint and key in `.env`

**Option C: OpenAI**

- Set `OPENAI_API_KEY` in `.env`

### 3. Run Your Workspace

```bash
npm run dev
```

You should see:

```
🤖 Agent Development Workspace
✅ Model Configuration Loaded
```

## Project Structure

```
src/
├── agents/          # Your agent implementations
├── tools/           # Tool definitions for agents
├── config/          # Configuration (modelConfig.ts)
└── index.ts         # Entry point
```

## Next Steps

1. **Create Your First Agent**

   - Create a file in `src/agents/myAgent.ts`
   - Use Microsoft Agent Framework to define your agent

2. **Define Tools**

   - Add tool definitions in `src/tools/`
   - Connect them to your agents

3. **Test Your Agents**
   - Run `npm run dev` to start
   - Debug with VS Code debugger

## Useful Commands

```bash
npm run dev      # Start in watch mode
npm run build    # Build TypeScript
npm start        # Run compiled code
```

## Resources & Documentation

- **Agent Framework**: https://github.com/microsoft/agent-framework
- **Model Context Protocol**: https://modelcontextprotocol.io
- **GitHub Models**: https://models.github.ai
- **Microsoft Foundry**: https://ai.azure.com

## Troubleshooting

**Error: "GITHUB_TOKEN is not set"**

- Make sure you've added your GitHub PAT to `.env`
- Restart terminal after updating `.env`

**Error: "Model not found"**

- Check that your `MODEL_ID` in `.env` is valid
- Visit https://models.github.ai to see available models

**TypeScript Errors**

- Run `npm run build` to check for compilation errors
- Ensure all dependencies are installed: `npm install`

## Support

For help with:

- **Agent Framework issues**: https://github.com/microsoft/agent-framework/issues
- **Model availability**: Check the model provider's documentation
- **General AI questions**: Visit the Model Context Protocol documentation

Happy coding! 🚀
