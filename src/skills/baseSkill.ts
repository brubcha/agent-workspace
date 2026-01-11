/**
 * Skill Base Class
 *
 * Skills are reusable capabilities that agents can use.
 * Examples: WebSearch, FileIO, DataAnalysis, etc.
 */

export interface SkillConfig {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export abstract class Skill {
  protected config: SkillConfig;

  constructor(config: SkillConfig) {
    this.config = config;
  }

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description;
  }

  abstract execute(input: any): Promise<any>;
}
