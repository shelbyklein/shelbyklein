import { Raw, Section } from 'reacticle';
import { sitePath } from '@/lib/site-path';

export function CreativeActivity() {
  return (
    <Section
      id="design-for-the-activity"
      index="02"
      title="Design for the activity"
    >
      <p>
        <a href={sitePath('/work/current')}>Current</a> works on a shorter
        timescale. Its live rhyme studio connects spoken or typed words with
        sounds and phrase ideas. A suggestion has a small window to be helpful;
        the interface needs to leave room for the writer’s train of thought.
        Audio, transcripts, and a rhyme log carry the session forward.
      </p>
      <Raw title="Suggestions beside the line">
        <figure className="essay-figure">
          <a href={sitePath('/work/current')}>
            <img
              src={sitePath('/images/current.webp')}
              width="1440"
              height="1100"
              loading="lazy"
              alt="Current rhyme studio showing rhymes for motion, phrase ideas, a rhyme scheme, and transcript controls."
            />
          </a>
          <figcaption>
            Current keeps rhymes, phrase ideas, and the developing pattern in
            one view.
          </figcaption>
        </figure>
      </Raw>
      <p>
        <a href={sitePath('/work/vispix')}>Vispix</a> brings photo search, team
        review, usage rights, and shortlists together. Its AI connection makes
        the existing library available in other workflows, too.
      </p>
      <p>
        Consolidation only helps when the activities belong together. Every
        feature has to earn its space. Deciding what shares context, what can
        happen automatically, and what needs human judgment is the real design
        work.
      </p>
    </Section>
  );
}
