import { Section, Raw } from 'reacticle';
import { toolGroups } from './data';
export function Publishing() {
  return (
    <Section
      id="websites-and-publishing"
      index="05"
      title="Websites and publishing"
    >
      <p>
        Publishing and maintaining the work matter just as much as making it.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          {toolGroups[3].items.map((tool) => (
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
