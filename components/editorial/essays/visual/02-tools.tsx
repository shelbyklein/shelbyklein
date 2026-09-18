import { Section, Raw } from 'reacticle';
export function VisualTools() {
  return (
    <Section
      id="from-seeing-to-doing"
      index="02"
      title="Seeing the relationship. Acting on the file."
    >
      <p>
        What interests me about Astra 6 is its apparent spatial understanding in
        these experiments: recognizing groups, separating foreground from
        background, and keeping track of relationships when objects move. That
        is my observation from working with it, not a claim about what happens
        inside the model.
      </p>
      <p>
        Recognition alone doesn’t produce an editable document. “This belongs
        behind that” has to become a layer order. “This needs room” has to
        become a position, a margin, or a different text frame.
      </p>
      <Raw title="The translation into tools">
        <dl className="essay-stack-list">
          <div>
            <dt>Visual intention</dt>
            <dd>Hierarchy, alignment, overlap, and emphasis.</dd>
          </div>
          <div>
            <dt>Native structure</dt>
            <dd>Layers, masks, vector paths, type styles, and artboards.</dd>
          </div>
          <div>
            <dt>Inspectable action</dt>
            <dd>
              Read the document, make a targeted change, render it, and review.
            </dd>
          </div>
        </dl>
      </Raw>
      <p>
        Adobe applications already have these handles. MCP tools can connect the
        model to them: inspecting a Photoshop document, adjusting a mask, or
        changing a text object instead of generating another flattened image.
        The useful interface gives it bounded actions and a record of what
        changed.
      </p>
      <p>
        More controls aren’t automatically better. I want the model to
        understand the document well enough to choose a small, purposeful
        action—and leave a working file a person can continue editing.
      </p>
    </Section>
  );
}
