import { Section, Raw } from 'reacticle';
import { InkSplitViewer } from '@/components/inksplit-viewer';
export function SectionOpening() {
  return (
    <Section
      id="reading-the-image"
      index="01"
      title="An image is an output. Where are the decisions?"
    >
      <p>
        A finished graphic shows the result, but hides the structure. A designer
        can read its hierarchy, spacing, contrast, and intention. Turning that
        understanding into something an AI can act on is a different task.
      </p>
      <p>
        I think of it like decompiling an old game. You have something that
        runs; you don’t have the source that explains how it was made. With an
        image, the missing source is the set of objects, layers, type choices,
        and relationships that make it editable.
      </p>
      <Raw title="From appearance to structure">
        <ol className="essay-sequence">
          <li>
            <span>01 / READ</span>
            <strong>The reference</strong>
            <p>What is visible: type, images, hierarchy.</p>
          </li>
          <li>
            <span>02 / INTERPRET</span>
            <strong>The relationships</strong>
            <p>What overlaps, aligns, and draws attention.</p>
          </li>
          <li>
            <span>03 / REBUILD</span>
            <strong>The working file</strong>
            <p>Layers, masks, and objects a person can edit.</p>
          </li>
        </ol>
      </Raw>
      <p>
        These InkSplit tests with Astra 6 Light make that translation visible.
        Build each poster from the bottom up, or isolate a layer group beside
        the original. The differences matter as much as the resemblance.
      </p>
      <Raw title="Inspect the reconstruction">
        <InkSplitViewer headingLevel={3} />
      </Raw>
      <p>
        This is interpreted structure, not recovered source. Some photographic
        elements were regenerated; fonts and masks are approximations. A
        convincing composite still needs to be inspected as a working file.
      </p>
    </Section>
  );
}
