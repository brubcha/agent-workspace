/**
 * Agent Workspace - Multiple Agents Example
 * 
 * Shows how to use multiple specialized agents with skills and resources
 */

import "dotenv/config";
import { CustomerSupportAgent } from "./agents/examples/customerSupportAgent";
import { CodeReviewerAgent } from "./agents/examples/codeReviewerAgent";
import { DataAnalystAgent } from "./agents/examples/dataAnalystAgent";
import { CalculatorSkill } from "./skills/calculatorSkill";
import { getModelConfig } from "./config/modelConfig";

async function main() {
  console.log("🤖 Multi-Agent Workspace Examples");
  console.log("==================================\n");

  try {
    const config = getModelConfig();
    console.log("✅ Configuration Loaded");
    console.log(`   Provider: ${config.provider}`);
    console.log(`   Model: ${config.modelId}\n`);

    // Example 1: Customer Support Agent
    console.log("📝 Example 1: Customer Support Agent");
    console.log("-------------------------------------");
    const supportAgent = new CustomerSupportAgent(config.apiKey, config.modelId, config.provider === "github");
    const customerResponse = await supportAgent.handleCustomerQuery(
      "How do I reset my password?",
      { accountId: "12345", status: "active" }
    );
    console.log(`Customer Support Response:\n${customerResponse}\n`);

    // Example 2: Code Reviewer Agent
    console.log("📝 Example 2: Code Reviewer Agent");
    console.log("----------------------------------");
    const reviewerAgent = new CodeReviewerAgent(config.apiKey, config.modelId, config.provider === "github");
    const codeReview = await reviewerAgent.reviewCode(
      `
function calculateSum(arr) {
  let total = 0;
  for (var i = 0; i < arr.length; i++) {
    total = total + arr[i];
  }
  return total;
}
      `.trim(),
      "javascript",
      "This is a utility function"
    );
    console.log(`Code Review:\n${codeReview}\n`);

    // Example 3: Data Analyst Agent
    console.log("📝 Example 3: Data Analyst Agent");
    console.log("---------------------------------");
    const analystAgent = new DataAnalystAgent(config.apiKey, config.modelId, config.provider === "github");
    const analysis = await analystAgent.analyzeData(
      {
        sales: [100, 150, 120, 180, 200],
        costs: [60, 70, 65, 90, 100],
        months: ["Jan", "Feb", "Mar", "Apr", "May"],
      },
      "What is the trend and profit margin?"
    );
    console.log(`Data Analysis:\n${analysis}\n`);

    // Example 4: Using Skills
    console.log("📝 Example 4: Using Skills");
    console.log("---------------------------");
    const calculator = new CalculatorSkill();
    console.log(`Available Skill: ${calculator.getName()}`);
    console.log(`Description: ${calculator.getDescription()}`);
    console.log(`(Skills can be attached to agents for extended capabilities)\n`);

    console.log("✅ All examples completed successfully!\n");
    console.log("📚 Next Steps:");
    console.log("1. Create your own agents in src/agents/examples/");
    console.log("2. Add custom skills in src/skills/");
    console.log("3. Create resource connectors in src/resources/");
    console.log("4. Build multi-agent workflows");

  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    console.error("\n⚠️  Make sure your .env file is configured with an API key!");
    process.exit(1);
  }
}

main().catch(console.error);
