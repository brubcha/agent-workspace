/**
 * Simple Assistant Agent
 *
 * A basic agent that uses HTTP requests to call the OpenAI API
 */

import * as https from "https";

export interface AgentResponse {
  message: string;
  timestamp: Date;
}

export class AssistantAgent {
  private apiKey: string;
  private model: string;
  private endpoint: string;
  private isGitHub: boolean;

  constructor(
    apiKey: string,
    model: string = "gpt-4o-mini",
    isGitHub: boolean = false
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.isGitHub = isGitHub;

    if (isGitHub) {
      this.endpoint = "models.inference.ai.azure.com";
    } else {
      this.endpoint = "api.openai.com";
    }
  }

  private makeRequest(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: this.endpoint,
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(responseData);
            if (
              parsed.choices &&
              parsed.choices[0] &&
              parsed.choices[0].message
            ) {
              resolve(parsed.choices[0].message.content);
            } else if (parsed.error) {
              reject(new Error(`API Error: ${parsed.error.message}`));
            } else {
              reject(new Error("Unexpected API response"));
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${responseData}`));
          }
        });
      });

      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }

  async ask(question: string): Promise<AgentResponse> {
    try {
      const payload = JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: question }],
        max_tokens: 1024,
      });

      const message = await this.makeRequest(payload);

      return {
        message,
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
      const payload = JSON.stringify({
        model: this.model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: 2048,
      });

      const message = await this.makeRequest(payload);

      return {
        message,
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
}
