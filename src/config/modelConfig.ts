/**
 * Model Configuration
 *
 * Configure your AI model provider and connection details here.
 * Supports: GitHub Models, Microsoft Foundry, OpenAI
 */

export interface ModelConfig {
  provider: "github" | "foundry" | "openai";
  modelId: string;
  apiKey: string;
  endpoint?: string;
}

export function getModelConfig(): ModelConfig {
  const provider = (process.env.MODEL_PROVIDER || "github") as
    | "github"
    | "foundry"
    | "openai";

  switch (provider) {
    case "github":
      return {
        provider: "github",
        modelId: process.env.MODEL_ID || "openai/gpt-4o-mini",
        apiKey: process.env.GITHUB_TOKEN || "",
        endpoint: "https://models.github.ai/inference/",
      };

    case "foundry":
      return {
        provider: "foundry",
        modelId: process.env.MODEL_ID || "gpt-4o",
        apiKey: process.env.FOUNDRY_KEY || "",
        endpoint: process.env.FOUNDRY_ENDPOINT,
      };

    case "openai":
      return {
        provider: "openai",
        modelId: process.env.MODEL_ID || "gpt-4o-mini",
        apiKey: process.env.OPENAI_API_KEY || "",
      };

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
