import { Raw, Section } from 'reacticle';

export function WorkModes() {
  return (
    <Section id="three-modes" index="01" title="Three modes, three rhythms">
      <p>
        I use AI constantly to make things for other people. A microsite such as
        Virtual Symposium or a data dashboard often has a clear finish. A
        focused session can be exactly the right container. But that is only one
        way I work.
      </p>
      <Raw title="The shape of the work">
        <ol className="essay-sequence">
          <li>
            <span>01 / MAKE</span>
            <strong>One-shot artifacts</strong>
            <p>A microsite, dashboard, or focused tool for someone else.</p>
          </li>
          <li>
            <span>02 / DEVELOP</span>
            <strong>Long-term software</strong>
            <p>
              Codex or Claude Code in an IDE, maintaining a product over time.
            </p>
          </li>
          <li>
            <span>03 / CONTINUE</span>
            <strong>Self-directed tasks</strong>
            <p>
              Graphics, video, InDesign, Canva, WordPress, and other website
              work.
            </p>
          </li>
        </ol>
      </Raw>
      <p>
        In the third mode, the tasks can be isolated while the project
        continues. Its files, decisions, and priorities need somewhere to live.
        These are different ways of thinking about work. Once I know what I
        need, how do I make AI ready to help execute it without rebuilding the
        context first?
      </p>
    </Section>
  );
}
