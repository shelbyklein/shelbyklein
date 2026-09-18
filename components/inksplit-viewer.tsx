'use client';

import { useEffect, useState } from 'react';
import tests from '@/content/inksplit-tests.json';
import { sitePath } from '@/lib/site-path';

export function InkSplitViewer({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const [selected, setSelected] = useState(0);
  const test = tests[selected];
  const [step, setStep] = useState(test.layers.length - 1);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const isolated = hover ?? pinned;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= test.layers.length - 1) setPlaying(false);
      else setStep(step + 1);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [playing, step, test.layers.length]);

  const src =
    isolated === null ? test.layers[step].build : test.layers[isolated].image;
  return (
    <section className="inksplit" aria-label="InkSplit layer explorer">
      <div className="inksplit-heading">
        <span className="eyebrow">ASTRA 6 LIGHT · INKSPLIT TESTS</span>
        <Heading>From a flat image to an editable stack</Heading>
        <p>
          Explore three reconstructions. Play the build, scrub through it, or
          hover over a layer group to inspect it. Click to keep it isolated;
          keyboard and touch work too.
        </p>
      </div>
      <div className="inksplit-tabs" aria-label="Choose a reconstruction">
        {tests.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === i}
            onClick={() => {
              setSelected(i);
              setStep(item.layers.length - 1);
              setPlaying(false);
              setPinned(null);
              setHover(null);
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="inksplit-workspace">
        <div className="inksplit-images">
          <figure>
            <figcaption>Original reference</figcaption>
            <div className="inksplit-canvas">
              <img
                loading="lazy"
                src={sitePath(test.original)}
                alt={`${test.title}: original flattened reference`}
              />
            </div>
          </figure>
          <figure>
            <figcaption>
              {isolated === null
                ? `Build · ${step + 1} / ${test.layers.length}`
                : 'Isolated layer group'}
            </figcaption>
            <div className="inksplit-canvas">
              <img
                loading="lazy"
                src={sitePath(src)}
                alt={`${test.title}: ${isolated === null ? `built through ${test.layers[step].name}` : test.layers[isolated].name}`}
              />
            </div>
          </figure>
        </div>
        <div
          className="inksplit-stack"
          aria-label="Photoshop layer groups, top to bottom"
        >
          <span className="eyebrow">LAYER STACK · TOP TO BOTTOM</span>
          {[...test.layers].reverse().map((layer, reverseIndex) => {
            const index = test.layers.length - 1 - reverseIndex;
            return (
              <button
                type="button"
                key={layer.image}
                className={
                  isolated === index
                    ? 'is-isolated'
                    : index <= step
                      ? 'is-built'
                      : ''
                }
                aria-pressed={pinned === index}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(index)}
                onBlur={() => setHover(null)}
                onClick={() => {
                  setPinned(pinned === index ? null : index);
                  setHover(null);
                  setPlaying(false);
                }}
              >
                <img loading="lazy" src={sitePath(layer.image)} alt="" />
                <span>{layer.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="inksplit-controls">
        <button
          type="button"
          onClick={() => {
            setHover(null);
            setPinned(null);
            if (playing) setPlaying(false);
            else {
              setStep(0);
              setPlaying(true);
            }
          }}
        >
          {playing ? 'Pause' : 'Play build'}
        </button>
        <label>
          Build progress
          <input
            aria-label="Build progress"
            type="range"
            min={0}
            max={test.layers.length - 1}
            value={step}
            onChange={(event) => {
              setStep(Number(event.target.value));
              setPlaying(false);
              setHover(null);
              setPinned(null);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setStep(test.layers.length - 1);
            setPinned(null);
            setHover(null);
          }}
        >
          Show complete
        </button>
      </div>
      <output className="inksplit-status" aria-live="polite">
        {isolated === null
          ? test.layers[step].name
          : `Inspecting: ${test.layers[isolated].name}`}
      </output>
      <p className="inksplit-note">{test.note}</p>
      <p className="inksplit-note">
        Small PNG previews exported from the PSDs. Each build step is rendered
        in Photoshop to preserve compositing. The stack follows the document’s
        top-level layers and groups; isolated previews may look different
        without the layers underneath. These are interpreted reconstructions,
        not recovered original files.
      </p>
    </section>
  );
}
