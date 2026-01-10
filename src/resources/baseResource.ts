/**
 * Resource Base Class
 * 
 * Resources are external systems agents can access.
 * Examples: Database, API, FileSystem, etc.
 */

export interface ResourceConfig {
  name: string;
  type: string;
  connection?: Record<string, any>;
}

export abstract class Resource {
  protected config: ResourceConfig;
  protected connected: boolean = false;

  constructor(config: ResourceConfig) {
    this.config = config;
  }

  getName(): string {
    return this.config.name;
  }

  getType(): string {
    return this.config.type;
  }

  isConnected(): boolean {
    return this.connected;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query(input: any): Promise<any>;
}
