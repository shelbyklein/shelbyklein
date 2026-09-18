import { Raw, Section } from 'reacticle';
import { sitePath } from '@/lib/site-path';

export function CreativeContext() {
  return (
    <Section id="keep-context-close" index="01" title="Keep the context close">
      <p>
        My work spans websites, identities, apparel, broadcasts, physical
        products, and software. Looking across it, a recurring interest becomes
        clear: I like making things, and improving the tools that help people
        make them.
      </p>
      <p>
        Creative work brings coordination with it. The conversation is in one
        app, files in another, and the reference in a browser tab. Finding
        everything becomes a task of its own. I want less repeated setup and
        more time with the idea.
      </p>
      <p>
        <a href={sitePath('/work/newton')}>Newton</a> brings persistent AI
        teammates, projects, conversations, and recurring work into a desktop
        workspace, connecting tools such as Codex CLI and Claude Code. The
        question is how to make work easier to return to: what was happening,
        who was handling it, and what needs attention next?
      </p>
      <Raw title="A workspace to return to">
        <figure className="essay-figure">
          <a href={sitePath('/work/newton')}>
            <img
              src={sitePath('/images/newton.webp')}
              width="1800"
              height="1280"
              loading="lazy"
              alt="Newton’s welcome screen with project navigation, teammates, and recurring-work controls."
            />
          </a>
          <figcaption>
            Newton begins with a project, then the bots needed to work on it.
          </figcaption>
        </figure>
      </Raw>
    </Section>
  );
}
