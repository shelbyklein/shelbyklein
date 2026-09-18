import { WorkModes } from './01-modes';
import { WorkEnvironment } from './02-environment';
import { WorkDevelopment } from './03-development';

export const workAiSections = [
  { id: 'three-modes', title: 'Three modes, three rhythms' },
  { id: 'an-environment', title: 'Bots, projects, and a place to act' },
  { id: 'room-to-develop', title: 'Room to work outside the abstraction' },
];
export function WorkAiEssay() {
  return (
    <>
      <WorkModes />
      <WorkEnvironment />
      <WorkDevelopment />
    </>
  );
}
