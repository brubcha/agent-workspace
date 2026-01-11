/**
 * Marketing Agent
 *
 * Generates comprehensive marketing kits from client data using a structured prompt.
 * Maintains consistency across all kits with the same styling and structure.
 * Modifies copy based on client-specific data while keeping layout constant.
 */

import { AssistantAgent } from "../assistantAgent";
import {
  ClientData,
  WebsiteScrapedData,
  MarketingKitInput,
} from "./marketingKitTypes";

export class MarketingAgent extends AssistantAgent {
  constructor(
    apiKey: string,
    model: string = "gpt-4o-mini",
    isGitHub: boolean = false
  ) {
    super(apiKey, model, isGitHub);
  }

  /**
   * Generates a complete marketing kit from client data
   */
  async generateMarketingKit(input: MarketingKitInput): Promise<string> {
    const {
      clientData,
      websiteData,
      meetingNotes,
      questionnaireResponses,
      caseStudiesProof,
      additionalContext,
    } = input;

    // Build context from all available data sources
    const clientContext = this.buildClientContext(
      clientData,
      websiteData,
      meetingNotes,
      questionnaireResponses,
      caseStudiesProof,
      additionalContext
    );

    // The main prompt that will generate the marketing kit
    const marketingKitPrompt = `${this.getMarketingKitMasterPrompt()}

[CLIENT INPUT DATA]
${clientContext}

Generate a complete Marketing Kit following the exact structure and format specified above. 
Ensure all opening tables are included first, then proceed with each section in order.
Use only the provided client data - do not invent facts.
If information is missing, mark with [FILL] in opening tables only and list gaps under "Open Items".`;

    const response = await this.ask(marketingKitPrompt);
    return response.message;
  }

  /**
   * Generates just the brand voice section for quick reference
   */
  async generateBrandVoice(
    clientData: ClientData,
    websiteData?: WebsiteScrapedData
  ): Promise<string> {
    const prompt = `You are a brand strategist. Based on this client data, create a detailed Brand Voice section:

Company: ${clientData.clientName}
Primary Offerings: ${clientData.primaryOfferings.join(", ")}
Brand Promise: ${clientData.brandPromise || "[Not provided]"}
Voice Traits: ${clientData.voiceTraits?.join(", ") || "[Not provided]"}
Differentiators: ${clientData.differentiators?.join(", ") || "[Not provided]"}
${
  websiteData?.voiceSamples
    ? `Voice Samples: ${websiteData.voiceSamples.join("; ")}`
    : ""
}

Create a Brand Voice section that includes:
1. Essence (one sentence)
2. Purpose (one paragraph)
3. Personality (3-5 adjectives with explanations)
4. Tone examples (3 sample lines that model the voice)
5. Voice in action (how the brand speaks across channels)
6. Tagline options (3-5 options)
7. Do/Do Not list (5 pairs showing what to do and avoid)`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Generates audience and persona definitions
   */
  async generateAudiencePersonas(clientData: ClientData): Promise<string> {
    const prompt = `You are an audience strategist. Create 3-5 detailed buyer personas for:

Company: ${clientData.clientName}
Primary Offerings: ${clientData.primaryOfferings.join(", ")}
Target Industries: ${clientData.priorityIndustries.join(", ")}
Target Regions: ${clientData.targetRegions.join(", ")}
ICP: ${clientData.icp || "[Not provided]"}
Pain Points: ${clientData.painPoints?.join("; ") || "[Not provided]"}
Desired Outcomes: ${clientData.desiredOutcomes?.join("; ") || "[Not provided]"}

For each persona, include:
- Name and title
- Industry/role
- Primary pain point
- Desired outcome
- Buying process
- Key influences
- Common objections
- Success metric

Format as detailed paragraphs with labeled bullets.`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Generates SEO and keyword strategy
   */
  async generateSEOStrategy(clientData: ClientData): Promise<string> {
    const prompt = `You are an SEO strategist. Create a comprehensive SEO and keyword strategy for:

Company: ${clientData.clientName}
Offerings: ${clientData.primaryOfferings.join(", ")}
Industries: ${clientData.priorityIndustries.join(", ")}
Core Keywords: ${clientData.coreKeywords?.join(", ") || "[Not provided]"}
Differentiators: ${clientData.differentiators?.join(", ") || "[Not provided]"}

Create a strategy including:
1. 4-5 keyword pillars with primary and secondary keywords
2. Content hub structure (/blog, /resources, /solutions, etc.)
3. Internal linking strategy
4. Target keyword difficulty levels
5. Content calendar themes aligned to keyword pillars

Format as narrative explanation + tables where appropriate.`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Generates a content calendar and social strategy
   */
  async generateSocialAndContentStrategy(
    clientData: ClientData
  ): Promise<string> {
    const prompt = `You are a content and social strategist. Create a social media and content strategy for:

Company: ${clientData.clientName}
Offerings: ${clientData.primaryOfferings.join(", ")}
Target Audience: ${clientData.icp || "[Not provided]"}
Social Channels: ${
      clientData.socialChannels?.join(", ") ||
      "LinkedIn, Twitter, Facebook, Instagram"
    }
Differentiators: ${clientData.differentiators?.join(", ") || "[Not provided]"}

Include:
1. Channel selection and content type mix
2. Posting cadence by channel
3. Content pillars (education, entertainment, promotion, etc.)
4. Campaign themes (4-6 quarterly campaigns)
5. Hashtag strategy (brand, category, location buckets)
6. Engagement and community building approach

Format as lists, tables, and short narrative.`;

    const response = await this.ask(prompt);
    return response.message;
  }

  /**
   * Generates content brief templates for downstream use
   */
  async generateContentBrief(
    contentType: "blog" | "email" | "social" | "landing-page",
    clientData: ClientData,
    topic: string
  ): Promise<string> {
    const briefPrompts: Record<string, string> = {
      blog: `Create a comprehensive blog brief for a ${
        clientData.clientName
      } blog post about "${topic}".

Include:
- SEO Keywords (primary + secondary)
- H1 and recommended H2 structure
- Target audience segment
- Key messaging points
- Internal links to use
- CTAs to include
- Word count target (≥750 words)
- Voice and tone reminders

${
  clientData.coreKeywords
    ? `Use these core keywords: ${clientData.coreKeywords.join(", ")}`
    : ""
}`,

      email: `Create an email brief for ${clientData.clientName} about "${topic}".

Include:
- Email type (promotional, educational, nurture)
- Subject line (≤7 words)
- Preview line (≤80 chars)
- Email structure (hook, value, proof, CTA, PS)
- Target segment
- Primary and secondary CTAs
- Links to include
- Voice reminders`,

      social: `Create a social media posting brief for ${
        clientData.clientName
      } about "${topic}".

Include:
- Platform-specific posts (LinkedIn, Twitter, Instagram, Facebook)
- Content hook/opening variation
- Hashtag recommendations (6-10 balanced mix)
- Visual guidelines
- CTA suggestions
- Posting cadence

Channels: ${clientData.socialChannels?.join(", ") || "LinkedIn, Twitter"}`,

      "landing-page": `Create a landing page brief for ${clientData.clientName} about "${topic}".

Include:
- Page URL and meta information
- H1 headline and subheading
- Value proposition bullets (3-5)
- Problem and solution section outline
- Proof/social proof to highlight
- FAQ structure (6 questions)
- Primary and secondary CTAs
- Technical SEO requirements`,
    };

    const response = await this.ask(
      briefPrompts[contentType] || briefPrompts.blog
    );
    return response.message;
  }

  /**
   * Private helper: Build full client context from all sources
   */
  private buildClientContext(
    clientData: ClientData,
    websiteData?: WebsiteScrapedData,
    meetingNotes?: string,
    questionnaireResponses?: Record<string, string>,
    caseStudiesProof?: string[],
    additionalContext?: string
  ): string {
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
   * Private helper: Return the master marketing kit prompt
   */
  private getMarketingKitMasterPrompt(): string {
    return `[ROLE]

    // Attempt to load a template file exported from the example marketing kit PDF.
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
        const fallback = `[ROLE]
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
`;

        // Provide the exact template plus the instruction contract as the prompt.
        return `${fallback}\n\n[REFERENCE TEMPLATE - DO NOT ALTER]\n${templateText}\n\n[END REFERENCE TEMPLATE]`;
      }
    } catch (e) {
      // if reading fails, fall through to the hardcoded prompt below
    }

    return `[ROLE]
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
`;

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
  }
}
