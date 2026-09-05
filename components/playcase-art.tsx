import { sitePath } from '@/lib/site-path';
import visuals from '@/content/playcase-visuals.json';

export function PlayCaseArt({ eager = false }: { eager?: boolean }) {
  return <div className="playcase-art">
    {[visuals.cover, visuals.alternate].map(image => <img
      key={image.src}
      src={sitePath(image.src)}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
    />)}
  </div>;
}
