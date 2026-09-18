import { Section, Raw } from 'reacticle';
import { toolGroups } from './data';
export function Inspirations() {
  return (
    <Section id="ideas-im-watching" index="06" title="Ideas I’m watching">
      <p>
        These projects are references and inspiration for my own work, rather
        than a list of products I use every day.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          {toolGroups[4].items.map((tool) => (
            <a className="essay-tool-link" href={tool.href} key={tool.href}>
              {tool.logo ? (
                <img
                  src={tool.logo}
                  alt=""
                  width="28"
                  height="28"
                  loading="lazy"
                />
              ) : (
                <span aria-hidden="true" className="essay-tool-monogram">
                  {tool.monogram}
                </span>
              )}
              <span>
                <strong>{tool.name}</strong>
                <small>{tool.description}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </Raw>
      <p>
        I add to this log when a tool earns a durable place in my work. Some
        serve a one-shot artifact; others support a long-running project or one
        of the many tasks in a creative practice.
      </p>
    </Section>
  );
}
