/**
 * GitHub Models Provider Implementation
 * Supports GitHub Models inference API
 * Free tier available
 */

import * as https from "https";
import { IAIProvider, AIResponse, AIMessage } from "./iaIProvider";
import { ProviderConfig } from "../../config/aiProviderConfig";

export class GitHubModelsProvider implements IAIProvider {
  private token: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) {
      throw new Error("GitHub Models requires API_KEY. Set AI_API_KEY environment variable with GitHub PAT token.");
    }
    this.token = config.apiKey;
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
      messages: conversationMessages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    };

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "models.inference.ai.azure.com",
        path: `/models?api-version=2024-05-01-preview`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(payload)),
          "User-Agent": "MyAgent",
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
              reject(new Error(`GitHub Models error: ${result.error.message}`));
              return;
            }
            resolve({
              message: result.choices[0].message.content,
              usage: {
                inputTokens: result.usage.prompt_tokens || 0,
                outputTokens: result.usage.completion_tokens || 0,
              },
            });
          } catch (e) {
            reject(new Error(`Failed to parse GitHub Models response: ${e}`));
          }
        });
      });

      req.on("error", reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  getName(): string {
    return `GitHub Models (${this.model})`;
  }
}
