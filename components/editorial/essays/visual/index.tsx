import { SectionOpening } from './01-opening';
import { VisualTools } from './02-tools';
import { VisualJudgment } from './03-judgment';
export const visualSections = [
  { id: 'reading-the-image', title: 'Reading the image' },
  { id: 'from-seeing-to-doing', title: 'From seeing to doing' },
  { id: 'the-human-part', title: 'The human part' },
];
export function VisualEssay() {
  return (
    <>
      <SectionOpening />
      <VisualTools />
      <VisualJudgment />
    </>
  );
}
