/**
 * Unified AI Provider Interface
 * All provider adapters implement this interface
 */

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIResponse {
  message: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface IAIProvider {
  /**
   * Send a message and get a response from the AI model
   * @param prompt - The user prompt/message
   * @param messages - Optional conversation history
   * @returns Promise<AIResponse> - Response from the model
   */
  complete(prompt: string, messages?: AIMessage[]): Promise<AIResponse>;

  /**
   * Get provider name for logging
   */
  getName(): string;
}
