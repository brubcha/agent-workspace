/**
 * Agent Factory
 *
 * Creates agents based on configuration
 */

import { AssistantAgent } from "../agents/assistantAgent";
import { getModelConfig } from "./modelConfig";

export function createAgent(): AssistantAgent {
  const config = getModelConfig();

  if (!config.apiKey) {
    throw new Error(
      `API key not configured. Please set ${
        config.provider === "github" ? "GITHUB_TOKEN" : "OPENAI_API_KEY"
      } in your .env file`
    );
  }

  const isGitHub = config.provider === "github";
  return new AssistantAgent(config.apiKey, config.modelId, isGitHub);
}
