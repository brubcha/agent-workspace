import { AssistantAgent } from "../assistantAgent";
import * as fs from "fs";
import * as path from "path";
import { ClientData, MarketingKitInput } from "./marketingKitTypes";

/**
 * MarketingAgent specializes in generating comprehensive marketing kits
 * for brands, complete with brand voice, SEO strategy, audience personas,
 * social strategies, and full engagement frameworks.
 */
export default class MarketingAgent extends AssistantAgent {
  constructor(apiKey: string) {
    super(apiKey);
  }

  /**
   * Main method: Generate a complete marketing kit
   */
  async generateMarketingKit(input: MarketingKitInput): Promise<string> {
    const clientContext = this.buildClientContext(input);
    const masterPrompt = this.getMarketingKitMasterPrompt();
    const fullPrompt = `${masterPrompt}\n\nCLIENT INFORMATION:\n${clientContext}`;

    // Call the model to generate the marketing kit
    const response = await this.ask(fullPrompt);
    return response.message;
  }

  /**
   * Helper: Generate brand voice and positioning section
   */
  async generateBrandVoice(input: MarketingKitInput): Promise<string> {
    const clientContext = this.buildClientContext(input);
    const prompt = `You are a brand voice expert. Based on the following client information, create a detailed brand voice guide including:
- Brand essence and purpose
- Personality traits
- Tone examples (formal, casual, inspirational, etc.)
- Dos and don'ts
- Key taglines and messaging

CLIENT INFO:
${clientContext}`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Helper: Generate audience personas
   */
  async generateAudiencePersonas(input: MarketingKitInput): Promise<string> {
    const clientContext = this.buildClientContext(input);
    const prompt = `You are a market researcher. Based on the client information below, develop 3-5 detailed audience personas including:
- Persona name and role
- Demographics
- Pain points
- Goals and desired outcomes
- Typical channels and content preferences

CLIENT INFO:
${clientContext}`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Helper: Generate SEO strategy
   */
  async generateSEOStrategy(input: MarketingKitInput): Promise<string> {
    const keywords = input.clientData.coreKeywords?.join(", ") || "not specified";
    const prompt = `Create an SEO strategy for a brand with core keywords: ${keywords}
Include:
- Keyword pillars and clusters
- Content hub structure
- Internal linking recommendations
- Technical SEO checklist
Focus on the provided keywords and expand with related search intents.`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Helper: Generate social and content strategy
   */
  async generateSocialAndContentStrategy(
    input: MarketingKitInput
  ): Promise<string> {
    const clientContext = this.buildClientContext(input);
    const prompt = `Based on this client profile, develop a comprehensive social media and content strategy:

${clientContext}

Include:
- Social media channels and posting cadence
- Content types and themes
- Hashtag strategy
- Engagement tactics
- Campaign ideas
- Monthly content calendar outline`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Helper: Generate detailed content brief
   */
  async generateContentBrief(input: MarketingKitInput): Promise<string> {
    const clientContext = this.buildClientContext(input);
    const prompt = `Create a master content brief for this brand:

${clientContext}

Include:
- Content mission and goals
- Audience insights
- Key messaging pillars
- Content formats
- Publication channels
- Tone and voice guidelines
- Performance metrics`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Private helper: Build comprehensive client context string
   */
  private buildClientContext(input: MarketingKitInput): string {
    const { clientData, websiteData, meetingNotes, questionnaireResponses, caseStudiesProof, additionalContext } = input;

    let context = `Client Name: ${clientData.clientName}
Brand Domain: ${clientData.brandDomain || "[Not provided]"}
Primary Offerings: ${clientData.primaryOfferings.join(", ")}
Priority Industries: ${clientData.priorityIndustries.join(", ")}
Target Regions: ${clientData.targetRegions.join(", ")}`;

    if (clientData.businessGoal || clientData.revenueModel) {
      context += `\n\nBusiness Goals:
- Goal: ${clientData.businessGoal || "[Not provided]"}
- Revenue Model: ${clientData.revenueModel || "[Not provided]"}
- Delivery Model: ${clientData.deliveryModel || "[Not provided]"}`;
    }

    if (clientData.icp || clientData.targetSegments) {
      context += `\n\nTarget Audience:
- ICP: ${clientData.icp || "[Not provided]"}
- Target Segments: ${clientData.targetSegments?.join(", ") || "[Not provided]"}
- Pain Points: ${clientData.painPoints?.join("; ") || "[Not provided]"}
- Desired Outcomes: ${
        clientData.desiredOutcomes?.join("; ") || "[Not provided]"
      }`;
    }

    if (clientData.competitors && clientData.competitors.length > 0) {
      context += `\n\nCompetitors:
${clientData.competitors.map((c) => `- ${c.name}: ${c.notes}`).join("\n")}`;
    }

    if (clientData.brandPromise || clientData.positioningLine) {
      context += `\n\nBrand Positioning:
- Promise: ${clientData.brandPromise || "[Not provided]"}
- Positioning Line: ${clientData.positioningLine || "[Not provided]"}
- Differentiators: ${
        clientData.differentiators?.join(", ") || "[Not provided]"
      }`;
    }

    if (clientData.coreKeywords) {
      context += `\n\nKeywords & Content:
- Core Keywords: ${clientData.coreKeywords.join(", ")}
- Content Hubs: ${clientData.contentHubs?.join(", ") || "[Not provided]"}`;
    }

    if (clientData.metrics && clientData.metrics.length > 0) {
      context += `\n\nProof & Metrics:
${clientData.metrics.map((m) => `- ${m.stat} (${m.context})`).join("\n")}`;
    }

    if (websiteData) {
      context += `\n\nWebsite Content (Scraped):
${
  websiteData.homepage
    ? `- Homepage: ${websiteData.homepage.substring(0, 200)}...`
    : ""
}
${websiteData.sitetagline ? `- Tagline: ${websiteData.sitetagline}` : ""}
${
  websiteData.voiceSamples
    ? `- Voice Samples: ${websiteData.voiceSamples.join("; ")}`
    : ""
}`;
    }

    if (meetingNotes) {
      context += `\n\nMeeting Notes:
${meetingNotes}`;
    }

    if (questionnaireResponses) {
      context += `\n\nQuestionnaire Responses:
${Object.entries(questionnaireResponses)
  .map(([q, a]) => `- ${q}: ${a}`)
  .join("\n")}`;
    }

    if (caseStudiesProof && caseStudiesProof.length > 0) {
      context += `\n\nProof Library:
${caseStudiesProof.join("\n")}`;
    }

    if (additionalContext) {
      context += `\n\nAdditional Context:
${additionalContext}`;
    }

    return context;
  }

  /**
   * Private helper: Return the master marketing kit prompt with optional template reference
   */
  private getMarketingKitMasterPrompt(): string {
    const basePrompt = `[ROLE]
Act as an expert brand and marketing strategist. Create and organize a complete Marketing Kit in one response. Focus ONLY on kit development. Use ONLY the inputs provided. If any info is missing, write [FILL] in the opening tables only, and list gaps under "Open Items." Do not invent facts.

[FORMAT CONTRACT - READ FIRST]
- The output MUST begin with exactly two Markdown tables, in this order and with these titles:
  1) "📦 Kit Overview"
  2) "🧭 Kit Structure"
- Immediately after those, include a third table titled "Section-to-Engagement Index Mapping".
- Each MUST be a Markdown table, never lists or prose.
- If any field is unknown, fill with [FILL] while keeping the table structure.
- Do not add columns or rename titles.
- Do not use the em dash character. Use commas or hyphens instead.

[NO PLACEHOLDERS]
Do not leave [FILL] inside any live copy or URLs beyond the opening tables. If data is missing, list gaps once at the very end under "Open Items", then proceed using neutral phrasing in the copy.

[KIT SECTIONS - REQUIRED]
1. Overview - Purpose, how to use, quick summary
2. The Goal - Business and marketing goal, revenue and delivery model
3. Opportunity Areas - Workflow efficiency, digital tools, market trends
4. Key Findings - 6 truths revealed by inputs
5. Market Landscape - Macro trends, competitor patterns, channel opportunities
6. Audience & Personas - 3-5 personas with labeled bullets
7. B2B Industry Targets - Target segments with NAICS codes
8. Brand Archetypes - Primary and secondary with mission, voice, values, promise
9. Brand Voice - Essence, purpose, personality, tone examples, taglines, dos and don'ts
10. Content - Keyword strategy, hubs, blog structure
11. Social Strategy - Channels, content types, cadence, goals, campaigns
12. Engagement Framework - Initiatives, projects, deliverables, tasks
13. Digital Health & Technical Audit - Link to separate audit document
14. References - Source list
15. Accessibility & Inclusivity Notes - Alt text, contrast, plain language
16. Consistency Checklist - Final validation list
17. Open Items - Missing inputs and gaps

[STATIC SECTIONS - REQUIRED FOR ALL KITS]
Include these sections in every kit with consistent formatting:

1) Audience & Messaging Matrix - Table mapping segments to pains, outcomes, messages, proof, CTAs
2) Voice, Tone, and Do/Do Not - Voice traits and sample lines plus Do/Do Not pairs
3) Offer and CTA Library - Table of reusable offers with CTAs
4) SEO and Keyword Set - Pillars, keywords, internal link hubs
5) Hashtag Library - Brand, Category, Location buckets
6) Compliance and Accessibility Microcopy - Approved reusable lines
7) Engagement Index Mapping - Restate Project Types, Task Groups, Task Types
8) Deliverable Specs - Field and length requirements table
9) Reusable Copy Blocks - Boilerplates for brand one-liner, company boilerplate, email footer, etc.
10) Structural Templates - Mini schemas for Email, Social, Press Release, Landing Page
11) Alignment QA Gate - Rubric for brand validation

Output all tables exactly as specified. Maintain consistent structure across all kits.`;

    // Attempt to load a template file exported from the example marketing kit PDF
    try {
      const templatePath = path.join(
        process.cwd(),
        "docs",
        "assets",
        "marketing-kits",
        "MarketingKit_SwiftInnovation.txt"
      );
      if (fs.existsSync(templatePath)) {
        const templateText = fs.readFileSync(templatePath, "utf8");
        return `${basePrompt}\n\n[REFERENCE TEMPLATE - DO NOT ALTER]\n${templateText}\n\n[END REFERENCE TEMPLATE]`;
      }
    } catch (e) {
      // If reading fails, fall back to base prompt only
      console.warn("Template file not found or error reading it");
    }

    return basePrompt;
  }
}
