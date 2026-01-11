/**
 * AI Provider Configuration and Types
 * Supports switching between OpenAI, Anthropic, Ollama, and GitHub Models
 */

export enum AIProvider {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  OLLAMA = "ollama",
  GITHUB_MODELS = "github",
}

export interface ProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  [AIProvider.OPENAI]: "gpt-4o-mini",
  [AIProvider.ANTHROPIC]: "claude-3-haiku-20240307",
  [AIProvider.OLLAMA]: "mistral",
  [AIProvider.GITHUB_MODELS]: "gpt-4o-mini",
};

export const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  [AIProvider.OPENAI]: "https://api.openai.com/v1",
  [AIProvider.ANTHROPIC]: "https://api.anthropic.com",
  [AIProvider.OLLAMA]: "http://localhost:11434",
  [AIProvider.GITHUB_MODELS]: "https://models.github.ai/inference",
};

/**
 * Load provider configuration from environment variables
 * Defaults to OpenAI if not specified
 */
export function loadProviderConfig(): ProviderConfig {
  const providerString = (process.env.AI_PROVIDER || AIProvider.OPENAI).toLowerCase();
  const provider = (Object.values(AIProvider) as string[]).includes(providerString)
    ? (providerString as AIProvider)
    : AIProvider.OPENAI;

  const config: ProviderConfig = {
    provider,
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || DEFAULT_MODELS[provider],
    baseUrl: process.env.AI_BASE_URL,
    temperature: process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : 0.7,
    maxTokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : 2048,
  };

  // Validate required fields
  if (!config.apiKey && provider !== AIProvider.OLLAMA) {
    console.warn(
      `[ProviderConfig] No API key provided for ${provider}. Set AI_API_KEY environment variable.`
    );
  }

  return config;
}
