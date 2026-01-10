/**
 * Customer Support Agent Example
 * 
 * An agent that helps with customer support tasks
 */

import { AssistantAgent } from '../assistantAgent';

export class CustomerSupportAgent extends AssistantAgent {
  constructor(apiKey: string, model: string = 'gpt-4o-mini', isGitHub: boolean = false) {
    super(apiKey, model, isGitHub);
  }

  async handleCustomerQuery(customerMessage: string, context?: Record<string, any>): Promise<string> {
    const systemContext = context 
      ? `\n\nCustomer Context: ${JSON.stringify(context)}`
      : '';

    const response = await this.ask(
      `You are a helpful customer support agent. ${systemContext}\n\nCustomer: ${customerMessage}`
    );

    return response.message;
  }
}
