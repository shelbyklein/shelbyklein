import { Section, Raw } from 'reacticle';
export function HumanEditable() {
  return (
    <Section
      id="human-editable"
      index="03"
      title="AI can change the process. People still need to use the result."
    >
      <p>
        I’m exploring AI for prototypes, repetitive work, and custom
        development. But a business website still needs to be something a client
        can enter, understand, and change. I take pride in handing over tools
        people can actually operate.
      </p>
      <p>
        If you need a site, a second opinion on your setup, or help learning to
        use AI in your own work, I’d be glad to talk.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          <a
            className="essay-tool-link"
            href="mailto:shelbykleindesign@gmail.com?subject=WordPress%20website"
          >
            <span>
              <strong>Hire me for WordPress</strong>
              <small>
                Plan, design, build, or improve a site your team can use.
              </small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="essay-tool-link"
            href="mailto:shelbykleindesign@gmail.com?subject=WordPress%20consulting"
          >
            <span>
              <strong>WordPress consulting</strong>
              <small>Work through your site, stack, or next step.</small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="essay-tool-link"
            href="mailto:shelbykleindesign@gmail.com?subject=AI%20help%20and%20teaching"
          >
            <span>
              <strong>AI help and teaching</strong>
              <small>
                Learn practical ways to use AI in the work you already do.
              </small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </Raw>
    </Section>
  );
}
