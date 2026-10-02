// Layout for the homepage pegboard. Coordinates are in a 2460×824 design canvas that scales to the viewport height.
export const PEGBOARD_CANVAS = { w: 2460, h: 824 };

export type PegFixture = 'cut' | 'print' | 'clip' | 'phone' | 'tv' | 'laptop' | 'sticker' | 'stand';
export type PegTag = { text: string; color?: 'blue' | 'white'; x: number; y: number };
export type PegItem = {
  key: string;
  projectId: string;
  fixture: PegFixture;
  src: string;
  alt: string;
  x: number; y: number; w: number; h: number;
  /** Hanging items swing around this point (item coordinates). Shelf items omit it. */
  pivot?: [number, number];
  /** Pendulum stiffness; smaller things swing faster. */
  k?: number;
  tag?: PegTag;
};

export const pegItems: PegItem[] = [
  // Bay one: what clients and employers should see first.
  { key: 'playcase-blue', projectId: 'playcase', fixture: 'stand', src: '/images/playcase/play.webp', alt: 'PlayCase in blue, standing upright with a game on screen', x: 132, y: 22, w: 160, h: 290, tag: { text: 'PlayCase', color: 'blue', x: 112, y: 330 } },
  { key: 'jerseys', projectId: 'olympic-jerseys', fixture: 'clip', src: '/images/olympic-jersey-card.webp', alt: 'Team USA Olympic archery jersey', x: 386, y: 84, w: 210, h: 252, pivot: [105, -26], k: 24, tag: { text: 'Team USA jerseys', x: 386, y: 352 } },
  { key: 'sdhq', projectId: 'steam-deck-hq', fixture: 'phone', src: '/images/websites/steam-deck-hq-mobile.jpg', alt: 'Steam Deck HQ website on a phone', x: 640, y: 64, w: 160, h: 334, pivot: [80, 2], k: 22, tag: { text: 'Steam Deck HQ', x: 640, y: 412 } },
  { key: 'sea', projectId: 'sea-education', fixture: 'laptop', src: '/images/websites/sea-education-desktop.jpg', alt: 'Sea Education Association website on a laptop', x: 84, y: 400, w: 352, h: 234, tag: { text: 'Client websites', color: 'white', x: 84, y: 368 } },
  { key: 'marvel', projectId: 'archery-is-for-everyone', fixture: 'clip', src: '/images/Archery-is-for-Everyone.webp', alt: 'Archery is for Everyone campaign poster', x: 560, y: 488, w: 128, h: 150, pivot: [64, -26], k: 30, tag: { text: '× Marvel', x: 560, y: 654 } },
  { key: 'identities', projectId: 'national-event-identities', fixture: 'sticker', src: '/images/logos-usaa-scaled.webp', alt: 'National event identity', x: 696, y: 470, w: 96, h: 96, pivot: [48, 2], k: 34, tag: { text: 'Identities', x: 690, y: 582 } },
  { key: 'birds', projectId: 'tracker-trapper', fixture: 'cut', src: '/images/tracker-trapper/bird-friends.webp', alt: 'Tracker Trapper birds', x: 60, y: 668, w: 138, h: 92, tag: { text: 'Tracker Trapper', color: 'blue', x: 64, y: 784 } },
  { key: 'newton', projectId: 'newton', fixture: 'cut', src: '/images/newton-logo.png', alt: 'Newton', x: 250, y: 692, w: 64, h: 64 },
  { key: 'current', projectId: 'current', fixture: 'cut', src: '/images/apps/current-icon.png', alt: 'Current', x: 326, y: 692, w: 64, h: 64 },
  { key: 'flogg', projectId: 'flogg', fixture: 'cut', src: '/images/apps/flogg-icon.png', alt: 'Flogg', x: 402, y: 692, w: 64, h: 64 },
  { key: 'appleseed', projectId: 'newton', fixture: 'cut', src: '/images/apps/appleseed-icon.png', alt: 'Appleseed', x: 478, y: 692, w: 64, h: 64 },
  // Bay two: broadcast, installations, print, and more client sites.
  { key: 'broadcast', projectId: 'usa-archery-broadcast', fixture: 'tv', src: '/images/usaa-livestream-screenshot.webp', alt: 'USA Archery live broadcast graphics', x: 880, y: 72, w: 360, h: 212, pivot: [180, 2], k: 18, tag: { text: 'USA Archery Live', x: 880, y: 300 } },
  { key: 'us-open', projectId: 'us-open', fixture: 'clip', src: '/images/us-open-fan-experience-7.jpg', alt: 'U.S. Open fan experience installation', x: 1296, y: 96, w: 196, h: 174, pivot: [98, -26], k: 26, tag: { text: 'U.S. Open', x: 1296, y: 286 } },
  { key: 'field-studies', projectId: 'field-studies', fixture: 'phone', src: '/images/websites/field-studies-mobile.jpg', alt: 'The School for Field Studies website on a phone', x: 1548, y: 64, w: 160, h: 334, pivot: [80, 2], k: 22, tag: { text: 'Field Studies', x: 1548, y: 412 } },
  { key: 'workplace', projectId: 'workplace-solutions', fixture: 'laptop', src: '/images/websites/workplace-solutions-desktop.jpg', alt: 'Workplace Solutions website on a laptop', x: 924, y: 400, w: 352, h: 234, tag: { text: 'Workplace Solutions', color: 'white', x: 924, y: 368 } },
  { key: 'brochure', projectId: 'sfs-brochure', fixture: 'clip', src: '/images/2023-SFS-Brochure-Page-1-1024x662.webp', alt: 'SFS recruitment brochure spread', x: 1310, y: 480, w: 232, h: 150, pivot: [116, -26], k: 26, tag: { text: 'SFS brochure', x: 1310, y: 644 } },
  { key: 'vispix', projectId: 'vispix', fixture: 'sticker', src: '/images/vispix-logo.png', alt: 'Vispix', x: 1592, y: 500, w: 88, h: 88, pivot: [44, 2], k: 34, tag: { text: 'Vispix', color: 'blue', x: 1592, y: 602 } },
  // Bay three: colorways, then the note at the end of the wall.
  { key: 'playcase-red', projectId: 'playcase', fixture: 'cut', src: '/images/playcase/dual-screen-red.webp', alt: 'PlayCase in red', x: 1790, y: 70, w: 220, h: 220, pivot: [110, 42], k: 21, tag: { text: 'Colorways', x: 1814, y: 284 } },
  { key: 'playcase-grey', projectId: 'playcase', fixture: 'cut', src: '/images/playcase/classic-grey.webp', alt: 'PlayCase in grey', x: 1790, y: 380, w: 220, h: 220, pivot: [110, 42], k: 21 },
];

/** Small acrylic stands that things sit in, drawn behind the item: [x, y, width]. */
export const pegStands: [number, number, number][] = [[112, 298, 200]];

export const pegShelves: [number, number, number][] = [[40, 634, 440], [40, 756, 760], [880, 634, 440]];
export const pegBoardTags: PegTag[] = [{ text: 'Apps & software', color: 'white', x: 630, y: 712 }];
/** The note that ends the wall hangs here. */
export const pegNote = { x: 2070, y: 150, w: 340, h: 360, pivot: [170, -26] as [number, number], k: 14 };
