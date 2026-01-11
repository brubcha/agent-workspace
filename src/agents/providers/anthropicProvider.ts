/**
 * Anthropic (Claude) Provider Implementation
 * Supports Claude 3 models (Opus, Sonnet, Haiku)
 */

import * as https from "https";
import { IAIProvider, AIResponse, AIMessage } from "./iaIProvider";
import { ProviderConfig } from "../../config/aiProviderConfig";

export class AnthropicProvider implements IAIProvider {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error("Anthropic requires API_KEY. Set AI_API_KEY environment variable.");
    }
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
  }

  async complete(prompt: string, messages?: AIMessage[]): Promise<AIResponse> {
    const conversationMessages: Array<{ role: string; content: string }> = messages
      ? messages.map((m) => ({ role: m.role, content: m.content }))
      : [];

    if (!messages) {
      conversationMessages.push({ role: "user", content: prompt });
    } else {
      conversationMessages.push({ role: "user", content: prompt });
    }

    const payload = {
      model: this.model,
      max_tokens: this.maxTokens,
      system:
        "You are a helpful assistant. Provide clear, concise, and accurate responses.",
      messages: conversationMessages,
    };

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(payload)),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (result.error) {
              reject(new Error(`Anthropic API error: ${result.error.message}`));
              return;
            }
            const message = result.content[0].text;
            resolve({
              message,
              usage: {
                inputTokens: result.usage.input_tokens,
                outputTokens: result.usage.output_tokens,
              },
            });
          } catch (e) {
            reject(new Error(`Failed to parse Anthropic response: ${e}`));
          }
        });
      });

      req.on("error", reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  getName(): string {
    return `Anthropic Claude (${this.model})`;
  }
}
