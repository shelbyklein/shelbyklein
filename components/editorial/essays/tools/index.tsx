import { Section } from 'reacticle';
import { sitePath } from '@/lib/site-path';
import { GithubReference } from './01-github';
import { AiCoding } from './02-ai-and-coding';
import { CreativeProduction } from './03-creative-production';
import { DesignResearch } from './04-design-research';
import { Publishing } from './05-websites-and-publishing';
import { Inspirations } from './06-ideas-im-watching';
export const toolsSections = [
  { id: 'code-and-references', title: 'Code and references' },
  { id: 'ai-and-coding', title: 'AI and coding' },
  { id: 'creative-production', title: 'Creative production' },
  { id: 'design-research', title: 'Design research' },
  { id: 'websites-and-publishing', title: 'Websites and publishing' },
  { id: 'tools-i-build', title: 'Tools I build' },
  { id: 'ideas-im-watching', title: 'Ideas I\u2019m watching' },
];
export function ToolsEssay() {
  return (
    <>
      <GithubReference />
      <AiCoding />
      <CreativeProduction />
      <DesignResearch />
      <Publishing />
      <Section id="tools-i-build" title="Tools I build">
        <p>Alongside those tools, I build interfaces around the work I return to.</p>
        <ul>
          <li><strong><a href={sitePath('/work/chatterbox')}>Chatterbox</a></strong> — A native Mac workspace for project conversations with Claude and Codex, including progress and steering while an agent works.</li>
          <li><strong><a href={sitePath('/work/spoolside')}>Spoolside</a></strong> — The workshop dashboard behind PlayCase, connecting orders, printer status, files, and production checks.</li>
          <li><strong>Peppy</strong> — My native InDesign plug-in for letting agents work in open documents, with named undo steps and explicit saves.</li>
        </ul>
        <p>Updated October 2026. The original publication date is retained.</p>
      </Section>
      <Inspirations />
    </>
  );
}
