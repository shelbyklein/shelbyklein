import { Raw, Section } from 'reacticle';
import { sitePath } from '@/lib/site-path';

export function WorkEnvironment() {
  return (
    <Section
      id="an-environment"
      index="02"
      title="Bots, projects, and a place to act"
    >
      <p>
        <a href={sitePath('/work/newton')}>Newton</a> is my answer. Bots do the
        work, with their own roles, responsibilities, and tools. Projects hold
        the context: people, files, conversations, and decisions. The dashboard
        gives me a way to direct and review the work in the form it needs.
      </p>
      <Raw title="A home for the project">
        <figure className="essay-figure">
          <img
            src={sitePath('/images/newton.webp')}
            width="1800"
            height="1280"
            loading="lazy"
            alt="Newton welcome screen with project navigation and a Create a project button."
          />
          <figcaption>
            Newton’s welcome screen introduces projects and bots as the starting
            point.
          </figcaption>
        </figure>
      </Raw>
      <p>
        That interface might be a board, an approval queue, a calendar, a
        document, or something specific to the task. The point is to keep the
        work compartmentalized and logically organized while leaving room for
        different ways of executing it.
      </p>
      <p>
        A useful workspace lets me return to a project with its history intact.
        I can see who is doing what and decide what needs my attention next.
      </p>
    </Section>
  );
}
