/**
 * Data Analyst Agent Example
 * 
 * An agent that analyzes data and generates insights
 */

import { AssistantAgent } from '../assistantAgent';

export class DataAnalystAgent extends AssistantAgent {
  constructor(apiKey: string, model: string = 'gpt-4o-mini', isGitHub: boolean = false) {
    super(apiKey, model, isGitHub);
  }

  async analyzeData(data: any, question: string, context?: string): Promise<string> {
    const prompt = `You are a data analysis expert. Analyze the following data and answer the question.
${context ? `\n\nContext: ${context}` : ''}

Data:
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

Question: ${question}

Provide insights, patterns, and recommendations based on the data.`;

    const response = await this.ask(prompt);
    return response.message;
  }

  async generateReport(data: any, title: string, metrics: string[]): Promise<string> {
    const prompt = `You are a data analysis expert. Generate a professional report based on the following data.

Title: ${title}
Key Metrics to Include: ${metrics.join(', ')}

Data:
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

Generate a comprehensive report with sections for:
1. Executive Summary
2. Key Findings
3. Detailed Analysis
4. Recommendations`;

    const response = await this.ask(prompt);
    return response.message;
  }
}
