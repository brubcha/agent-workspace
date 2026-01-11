/**
 * Simple Assistant Agent
 *
 * A flexible agent that uses pluggable AI providers via factory pattern
 * Supports: OpenAI, Anthropic, Ollama, GitHub Models
 */

import { ProviderFactory } from "./providers/providerFactory";
import { IAIProvider, AIMessage } from "./providers/iaIProvider";

export interface AgentResponse {
  message: string;
  timestamp: Date;
}

export class AssistantAgent {
  private provider: IAIProvider;

  constructor() {
    // Provider is initialized from environment variables via factory
    this.provider = ProviderFactory.createProvider();
  }

  async ask(question: string): Promise<AgentResponse> {
    try {
      const response = await this.provider.complete(question);

      return {
        message: response.message,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(
        `Agent error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async chat(
    messages: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<AgentResponse> {
    try {
      const aiMessages: AIMessage[] = messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      const response = await this.provider.complete("", aiMessages);

      return {
        message: response.message,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(
        `Agent error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get the current provider name for debugging/logging
   */
  getProvider(): string {
    return this.provider.getName();
  }
}
