import { Section, Raw } from 'reacticle';
const stack = [
  ['WordPress', 'The publishing foundation.'],
  ['ACF Pro', 'Structured content that a client can edit.'],
  ['Bricks Builder', 'The site’s front end.'],
  [
    'Automatic.css',
    'A shared framework for spacing, type, colors, and components.',
  ],
  ['SchemaWP', 'Structured data.'],
  ['WS Form Pro', 'Forms that do real work.'],
  [
    'Advanced Scripts',
    'My current approach to custom scripts; this may change as I experiment with AI tools.',
  ],
  ['All-in-One WP Migration · paid', 'Moving sites between environments.'],
];
export function WordPressStack() {
  return (
    <Section id="the-stack" index="01" title="A clear job for every tool">
      <p>
        I host WordPress sites on <a href="https://runcloud.io/">RunCloud</a>.
        The tools underneath each site have distinct jobs; together, they give
        the organization a system it can keep using after launch.
      </p>
      <Raw title="My working stack">
        <dl className="essay-stack-list">
          {stack.map(([name, description]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </Raw>
      <p>
        I always start with a framework. Automatic.css gives pages shared rules,
        so adding a section doesn’t mean inventing the site again. The exact
        tools can change; the need for a maintainable system doesn’t.
      </p>
    </Section>
  );
}
