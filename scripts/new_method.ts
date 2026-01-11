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
      console.warn("Template file not found or error reading it, using base prompt only");
    }

    return basePrompt;
  }
