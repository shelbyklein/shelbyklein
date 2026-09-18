import { Section, Raw } from 'reacticle';
export function GithubReference() {
  return (
    <Section
      id="code-and-references"
      index="01"
      title="Code, experiments, and references"
    >
      <p>
        My GitHub brings together public code and projects that inform my own
        work. This log is a brief companion: what each tool does, and why I
        return to it.
      </p>
      <Raw>
        <div className="essay-tool-grid">
          <a className="essay-tool-link" href="https://github.com/shelbyklein">
            <span>
              <strong>My GitHub</strong>
              <small>Public code, prototypes, and projects.</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="essay-tool-link"
            href="https://github.com/shelbyklein?tab=stars"
          >
            <span>
              <strong>Starred repositories</strong>
              <small>A growing collection of ideas and references.</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Raw>
    </Section>
  );
}
