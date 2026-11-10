import { Raw, Section } from 'reacticle';
import { sitePath } from '@/lib/site-path';

export function CreativeBoundaries() {
  return (
    <Section
      id="beyond-the-window"
      index="03"
      title="Beyond the software window"
    >
      <p>
        That thinking extends beyond software.{' '}
        <a href={sitePath('/work/playcase')}>PlayCase</a> gives an iPhone
        physical controls and swappable layouts for classic games, spanning
        industrial design, prototyping, and production.
      </p>
      <Raw title="Physical interfaces">
        <div className="essay-image-pair" style={{ gridTemplateColumns: '1fr' }}>
          <figure className="essay-figure">
            <a href={sitePath('/work/playcase')}>
              <img
                src={sitePath('/images/playcase/handheld-blue.webp')}
                width="1500"
                height="1500"
                loading="lazy"
                alt="Blue PlayCase body beside its removable directional-pad and button faceplate."
              />
            </a>
            <figcaption>
              PlayCase: changing the interface through physical controls.
            </figcaption>
          </figure>
        </div>
      </Raw>
      <p>
        <a href={sitePath('/work/arcadia')}>Arcadia</a> leaves room to
        experiment with AI activity as a simulated place you can see and
        navigate. Newton and Current remain in active development; Arcadia is an
        ongoing experiment.
      </p>
      <p>
        Building software creates maintenance work of its own. Reducing friction
        is something to test, not assume. Across these projects, I want to make
        it easier to stay with an idea and carry it through to something
        finished.
      </p>
    </Section>
  );
}
