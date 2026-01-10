/**
 * Agent Development Workspace
 *
 * Example: Simple Assistant Agent
 */

import "dotenv/config";
import { createAgent } from "./config/agentFactory";
import { getModelConfig } from "./config/modelConfig";

async function main() {
  console.log("🤖 Agent Development Workspace");
  console.log("================================\n");

  try {
    // Load config
    const config = getModelConfig();
    console.log("✅ Configuration Loaded");
    console.log(`   Provider: ${config.provider}`);
    console.log(`   Model: ${config.modelId}`);
    console.log(`   Endpoint: ${config.endpoint || "default"}\n`);

    // Create agent
    const agent = createAgent();
    console.log("✅ Agent Created\n");

    // Example 1: Ask a simple question
    console.log("📝 Example 1: Asking a question");
    console.log("Question: What is the capital of France?");
    const response1 = await agent.ask("What is the capital of France?");
    console.log(`Answer: ${response1.message}\n`);

    // Example 2: Multi-turn conversation
    console.log("📝 Example 2: Multi-turn conversation");
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      { role: "user", content: "What is 2 + 2?" },
    ];
    const response2 = await agent.chat(messages);
    console.log(`User: What is 2 + 2?`);
    console.log(`Agent: ${response2.message}\n`);

    // Add follow-up
    messages.push({ role: "assistant", content: response2.message });
    messages.push({ role: "user", content: "Multiply that by 5" });
    const response3 = await agent.chat(messages);
    console.log(`User: Multiply that by 5`);
    console.log(`Agent: ${response3.message}\n`);

    console.log("✅ Agent working successfully!\n");
    console.log("📚 Next Steps:");
    console.log("1. Edit .env to add your API key");
    console.log("2. Modify src/agents/ to create specialized agents");
    console.log("3. Add tools in src/tools/ for extended capabilities");
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    console.error(
      "\n⚠️  Make sure your .env file is configured with an API key!"
    );
    console.error("   • For GitHub Models: https://github.com/settings/tokens");
    console.error(
      "   • For OpenAI: https://platform.openai.com/account/api-keys\n"
    );
    process.exit(1);
  }
}

main().catch(console.error);

main().catch(console.error);
