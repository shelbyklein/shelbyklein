import { Section, Raw } from 'reacticle';
import { toolGroups } from './data';
export function DesignResearch() {
  return (
    <Section id="design-research" index="04" title="Design research">
      <p>
        I look at real interfaces to understand how other people solve the same
        interaction problems.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          {toolGroups[2].items.map((tool) => (
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
