import { Section, Raw } from 'reacticle';
import { toolGroups } from './data';
export function AiCoding() {
  return (
    <Section id="ai-and-coding" index="02" title="AI and coding">
      <p>
        Ideas, research, and code each call for a different kind of assistance.
        These are the tools I return to.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          {toolGroups[0].items.map((tool) => (
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
    </Section>
  );
}
