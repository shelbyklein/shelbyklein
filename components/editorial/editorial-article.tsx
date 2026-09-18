'use client';
import { Article, Hero, Lead, Raw, ThemeProvider } from 'reacticle';
import { sitePath } from '@/lib/site-path';
import { essayMeta } from './essay-meta';
import { VisualEssay, visualSections } from './essays/visual';
import { WorkAiEssay, workAiSections } from './essays/work-ai';
import { CreativeEssay, creativeSections } from './essays/creative';
import { WordPressEssay, wordpressSections } from './essays/wordpress';
import { ToolsEssay, toolsSections } from './essays/tools';
const essays = {
  'turning-visual-knowledge-into-llm-knowledge': {
    Body: VisualEssay,
    sections: visualSections,
  },
  'the-space-between-work-and-ai': {
    Body: WorkAiEssay,
    sections: workAiSections,
  },
  'creative-work-fewer-tools': {
    Body: CreativeEssay,
    sections: creativeSections,
  },
  'wordpress-sites-that-clients-can-use': {
    Body: WordPressEssay,
    sections: wordpressSections,
  },
  'a-working-tools-log': { Body: ToolsEssay, sections: toolsSections },
};
export function EditorialArticle({
  slug,
  title,
  date,
}: {
  slug: string;
  title: string;
  date: string;
}) {
  const essay = essays[slug as keyof typeof essays];
  const meta = essayMeta[slug];
  if (!essay || !meta) return null;
  const { Body, sections } = essay;
  const visual = slug === 'turning-visual-knowledge-into-llm-knowledge';
  return (
    <div className="editorial-article">
      <ThemeProvider theme="press">
        <section className="essay-cover" aria-label="Illustrated essay cover">
          <span className="essay-cover-label">SHELBY KLEIN / FIELD NOTES</span>
          <p className="essay-cover-title">{meta.cover}</p>
          <div
            className={
              visual
                ? 'essay-cover-art essay-cover-art--layers'
                : 'essay-cover-art'
            }
          >
            <img src={sitePath(meta.image)} alt={meta.alt} />
            {visual && (
              <>
                <img
                  src={sitePath(
                    '/images/inksplit/ghost-frequency-v2/layer-1.png',
                  )}
                  alt=""
                />
                <img
                  src={sitePath(
                    '/images/inksplit/ghost-frequency-v2/layer-3.png',
                  )}
                  alt=""
                />
              </>
            )}
          </div>
          <span className="essay-cover-caption">
            {visual
              ? 'ONE REFERENCE. MANY DECISIONS. Actual artwork from the InkSplit tests.'
              : 'Notes on creative work, technology, and the things I build.'}
          </span>
        </section>
        <Article width="regular">
          <Hero
            title={title}
            subtitle={meta.subtitle}
            meta={[
              { label: 'By', value: 'Shelby Klein' },
              {
                label: 'Published',
                value: new Date(`${date}T12:00:00Z`).toLocaleDateString(
                  'en-US',
                  { dateStyle: 'long', timeZone: 'UTC' },
                ),
              },
            ]}
          />
          <Lead>{meta.lead}</Lead>
          <Raw>
            <nav className="essay-nav" aria-label="In this essay">
              <span>IN THIS ESSAY</span>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  {s.title}
                </a>
              ))}
            </nav>
          </Raw>
          <Body />
          <Raw>
            <footer className="essay-colophon">
              Made with{' '}
              <a href="https://github.com/ConardLi/garden-skills">
                beautiful-article
              </a>{' '}
              · press theme
            </footer>
          </Raw>
        </Article>
      </ThemeProvider>
    </div>
  );
}
