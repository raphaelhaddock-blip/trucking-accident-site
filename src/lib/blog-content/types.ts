export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: 'guide' | 'legal' | 'safety' | 'news';
  funnelStage: 'awareness' | 'consideration' | 'decision';
  targetKeyword: string;
  readingTime: number; // minutes
  featured?: boolean;
  heroImage?: {
    url: string;
    alt: string;
  };
  introduction: string;
  sections: BlogSection[];
  faqs: BlogFAQ[];
  relatedAccidents: string[]; // accident slugs to link to
  relatedStates: string[]; // state slugs to link to
  relatedPosts: string[]; // other blog slugs
  cta: {
    headline: string;
    description: string;
  };
}

export interface BlogSection {
  heading: string;
  content: string; // Can include markdown-style formatting
  subsections?: {
    heading: string;
    content: string;
  }[];
}

export interface BlogFAQ {
  question: string;
  answer: string;
}
