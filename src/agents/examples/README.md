/\*\*

- Examples Directory
-
- This folder contains example agents that extend the base AssistantAgent.
-
- Current Examples:
- - customerSupportAgent.ts
- - codeReviewerAgent.ts
- - dataAnalystAgent.ts
-
- How to Use:
- 1.  Import an example agent
- 2.  Create an instance with your API key
- 3.  Call the specialized methods
-
- Example:
- ```

  ```
- import { CustomerSupportAgent } from './agents/examples/customerSupportAgent';
- const agent = new CustomerSupportAgent(apiKey);
- const response = await agent.handleCustomerQuery("I have a problem with...");
- ```

  ```
-
- How to Create Your Own:
- 1.  Extend AssistantAgent
- 2.  Add specialized methods for your use case
- 3.  Implement domain-specific prompts
      \*/
