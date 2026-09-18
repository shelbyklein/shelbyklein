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
      <Inspirations />
    </>
  );
}
