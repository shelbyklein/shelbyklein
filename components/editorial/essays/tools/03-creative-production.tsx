import { Section, Raw } from 'reacticle';
import { toolGroups } from './data';
export function CreativeProduction() {
  return (
    <Section id="creative-production" index="03" title="Creative production">
      <p>
        The output still needs to work in the medium it was made for: a printed
        page, a video, a vector file, or a sprite.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          {toolGroups[1].items.map((tool) => (
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
