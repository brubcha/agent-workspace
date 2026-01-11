/**
 * Code Reviewer Agent Example
 *
 * An agent that reviews code and provides feedback
 */

import { AssistantAgent } from "../assistantAgent";

export class CodeReviewerAgent extends AssistantAgent {
  constructor(
    apiKey: string,
    model: string = "gpt-4o-mini",
    isGitHub: boolean = false
  ) {
    super(apiKey, model, isGitHub);
  }

  async reviewCode(
    code: string,
    language: string,
    context?: string
  ): Promise<string> {
    const prompt = `You are an expert ${language} code reviewer. Review the following code and provide feedback on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance improvements
4. Security concerns
${context ? `\n\nContext: ${context}` : ""}

Code to review:
\`\`\`${language}
${code}
\`\`\``;

    const response = await this.ask(prompt);
    return response.message;
  }
}
