/**
 * OpenAI Provider Implementation
 * Supports GPT-4o, GPT-4o-mini, and other OpenAI models
 */

import * as https from "https";
import { IAIProvider, AIResponse, AIMessage } from "./iaIProvider";
import { ProviderConfig } from "../../config/aiProviderConfig";

export class OpenAIProvider implements IAIProvider {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error("OpenAI requires API_KEY. Set AI_API_KEY environment variable.");
    }
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
  }

  async complete(prompt: string, messages?: AIMessage[]): Promise<AIResponse> {
    const conversationMessages: Array<{ role: string; content: string }> = messages
      ? messages.map((m) => ({ role: m.role, content: m.content }))
      : [{ role: "user", content: prompt }];

    if (!messages) {
      conversationMessages.push({ role: "user", content: prompt });
    }

    const payload = {
      model: this.model,
      messages: conversationMessages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    };

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
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
              reject(new Error(`OpenAI API error: ${result.error.message}`));
              return;
            }
            const message = result.choices[0].message.content;
            resolve({
              message,
              usage: {
                inputTokens: result.usage.prompt_tokens,
                outputTokens: result.usage.completion_tokens,
              },
            });
          } catch (e) {
            reject(new Error(`Failed to parse OpenAI response: ${e}`));
          }
        });
      });

      req.on("error", reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  getName(): string {
    return `OpenAI (${this.model})`;
  }
}
