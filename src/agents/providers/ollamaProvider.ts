/**
 * Ollama Provider Implementation
 * Supports local models (Mistral, Llama2, Neural Chat, etc.)
 * Default: localhost:11434
 */

import * as http from "http";
import { IAIProvider, AIResponse, AIMessage } from "./iaIProvider";
import { ProviderConfig } from "../../config/aiProviderConfig";

export class OllamaProvider implements IAIProvider {
  private baseUrl: string;
  private model: string;
  private temperature: number;

  constructor(config: ProviderConfig) {
    this.baseUrl = config.baseUrl || "http://localhost:11434";
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
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
      messages: conversationMessages,
      stream: false,
      temperature: this.temperature,
    };

    return new Promise((resolve, reject) => {
      const url = new URL("/api/chat", this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || 11434,
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(payload)),
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (result.error) {
              reject(new Error(`Ollama error: ${result.error}`));
              return;
            }
            resolve({
              message: result.message.content,
              usage: {
                inputTokens: 0,
                outputTokens: 0,
              },
            });
          } catch (e) {
            reject(new Error(`Failed to parse Ollama response: ${e}`));
          }
        });
      });

      req.on("error", reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  getName(): string {
    return `Ollama (${this.model}) [Local]`;
  }
}
