/**
 * AI Provider Factory
 * Creates the appropriate provider instance based on configuration
 */

import { IAIProvider } from "./iaIProvider";
import { OpenAIProvider } from "./openaiProvider";
import { AnthropicProvider } from "./anthropicProvider";
import { OllamaProvider } from "./ollamaProvider";
import { GitHubModelsProvider } from "./githubModelsProvider";
import { loadProviderConfig, AIProvider } from "../../config/aiProviderConfig";

export class ProviderFactory {
  static createProvider(): IAIProvider {
    const config = loadProviderConfig();

    switch (config.provider) {
      case AIProvider.OPENAI:
        return new OpenAIProvider(config);

      case AIProvider.ANTHROPIC:
        return new AnthropicProvider(config);

      case AIProvider.OLLAMA:
        return new OllamaProvider(config);

      case AIProvider.GITHUB_MODELS:
        return new GitHubModelsProvider(config);

      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }
}
