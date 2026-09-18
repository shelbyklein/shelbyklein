import { CreativeContext } from './01-context';
import { CreativeActivity } from './02-activity';
import { CreativeBoundaries } from './03-boundaries';

export const creativeSections = [
  { id: 'keep-context-close', title: 'Keep the context close' },
  { id: 'design-for-the-activity', title: 'Design for the activity' },
  { id: 'beyond-the-window', title: 'Beyond the software window' },
];
export function CreativeEssay() {
  return (
    <>
      <CreativeContext />
      <CreativeActivity />
      <CreativeBoundaries />
    </>
  );
}
