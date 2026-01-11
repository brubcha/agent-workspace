/**
 * Client Data Interface
 * 
 * Defines the structure of client input data for marketing kit generation
 */

export interface ClientData {
  // Basic Info
  clientName: string;
  brandDomain: string;
  
  // Business Info
  primaryOfferings: string[];
  priorityIndustries: string[];
  targetRegions: string[];
  
  // Business Goals
  businessGoal?: string;
  revenueModel?: string;
  deliveryModel?: string;
  
  // Target Audience
  icp?: string; // Ideal Customer Profile
  targetSegments?: string[];
  painPoints?: string[];
  desiredOutcomes?: string[];
  
  // Competitive Info
  competitors?: Array<{
    name: string;
    notes: string;
  }>;
  differentiators?: string[];
  
  // Brand Info
  brandPromise?: string;
  positioningLine?: string;
  brandArchetype?: string;
  voiceTraits?: string[];
  
  // Content & Keywords
  coreKeywords?: string[];
  contentHubs?: string[];
  
  // Proof & Social
  caseStudies?: string[];
  testimonials?: string[];
  metrics?: Array<{
    stat: string;
    context: string;
  }>;
  socialChannels?: string[];
  
  // Contact
  primaryCTA?: string;
  contactEmail?: string;
  websiteUrl?: string;
}

export interface WebsiteScrapedData {
  homepage?: string;
  aboutPage?: string;
  productPages?: string[];
  pricingPage?: string;
  ctaText?: string[];
  sitetagline?: string;
  sitemap?: string;
  voiceSamples?: string[];
}

export interface MarketingKitInput {
  clientData: ClientData;
  websiteData?: WebsiteScrapedData;
  meetingNotes?: string;
  questionnaireResponses?: Record<string, string>;
  caseStudiesProof?: string[];
  additionalContext?: string;
}
