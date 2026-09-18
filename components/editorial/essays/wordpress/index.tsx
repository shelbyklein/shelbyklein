import { WordPressStack } from './01-stack';
import { WordPressExamples } from './02-in-practice';
import { HumanEditable } from './03-human-editable';
export const wordpressSections = [
  { id: 'the-stack', title: 'The stack' },
  { id: 'in-practice', title: 'In practice' },
  { id: 'human-editable', title: 'Human-editable work' },
];
export function WordPressEssay() {
  return (
    <>
      <WordPressStack />
      <WordPressExamples />
      <HumanEditable />
    </>
  );
}
