/**
 * Example Skill: Calculator
 *
 * A simple calculator skill that agents can use
 */

import { Skill } from "./baseSkill";

export class CalculatorSkill extends Skill {
  constructor() {
    super({
      name: "Calculator",
      description: "Perform mathematical calculations",
      parameters: {
        operation: "add | subtract | multiply | divide",
        a: "First number",
        b: "Second number",
      },
    });
  }

  async execute(input: {
    operation: string;
    a: number;
    b: number;
  }): Promise<number> {
    const { operation, a, b } = input;

    switch (operation) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        if (b === 0) throw new Error("Cannot divide by zero");
        return a / b;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }
}
