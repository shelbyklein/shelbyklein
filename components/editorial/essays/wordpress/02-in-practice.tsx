import { Section, Raw } from 'reacticle';
import { sitePath } from '@/lib/site-path';
const examples = [
  {
    name: 'Sea Education Association',
    href: 'https://sea.edu/',
    image: 'sea-education-desktop.jpg',
    alt: 'SEA program listing with search, program type and term filters above a Sea Expedition feature.',
    caption:
      'Programs, research, admissions, and a changing library of content.',
  },
  {
    name: 'School for Field Studies',
    href: 'https://fieldstudies.org/',
    image: 'field-studies-desktop.jpg',
    alt: 'School for Field Studies program finder with center filters and semester and summer program listings.',
    caption: 'Global field-study programs and enrollment information.',
  },
  {
    name: 'Steam Deck HQ',
    href: 'https://steamdeckhq.com/',
    image: 'steam-deck-hq-desktop.jpg',
    alt: 'Steam Deck HQ homepage featuring gaming news and reviews.',
    caption:
      'News, reviews, guides, and community content on an active editorial site.',
  },
];
export function WordPressExamples() {
  return (
    <Section
      id="in-practice"
      index="02"
      title="Built for work that keeps changing"
    >
      <p>
        These sites I’ve built have different audiences, but the same underlying
        requirement: people need to publish, update, and organize content long
        after the first launch.
      </p>
      <Raw>
        {examples.map((example) => (
          <figure className="essay-figure" key={example.href}>
            <a href={example.href}>
              <img
                src={sitePath('/images/websites/' + example.image)}
                alt={example.alt}
                width="1440"
                height="1000"
                loading="lazy"
              />
            </a>
            <figcaption>
              <a href={example.href}>{example.name}</a> — {example.caption}{' '}
              Existing portfolio screenshot.
            </figcaption>
          </figure>
        ))}
      </Raw>
    </Section>
  );
}
