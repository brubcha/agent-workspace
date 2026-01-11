/**
 * Agent Factory
 *
 * Creates agents based on configuration
 */

import { AssistantAgent } from "../agents/assistantAgent";

export function createAgent(): AssistantAgent {
  // AssistantAgent now uses provider factory to load config from environment
  // No configuration needed here - it's fully self-contained
  return new AssistantAgent();
}
