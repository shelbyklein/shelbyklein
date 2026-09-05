import studyData from '@/content/case-studies.json';

export type CaseStudy = {
  headline: string;
  intro: string;
  role: string;
  format: string;
  period?: string;
  coverCaption?: string;
  scope: { title: string; body: string }[];
  sections: { title: string; body: string }[];
  galleryTitle?: string;
  galleryIntro?: string;
  videoTitle?: string;
  videoIntro?: string;
  related: string[];
  article?: boolean;
};

export const caseStudies: Record<string, CaseStudy> = studyData;
