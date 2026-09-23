# Moonlit workshop hero

Standalone HTML/CSS/JS prototype. Serve the Geekifyinc workspace, then open `/experiments/parallax/moonlit-workshop/`. No build step or dependencies.

Uses all seven source PNGs from `output/illustration-layers`, plus the existing Geekify hero logo. The two room renders occupy the same midground position and crossfade with the Moonlit/Sunlit controls. The outer landscape stays moonlit in both settings.

Depth is set by each `data-depth` attribute: landscape 6, bookcase 11, workshop 15, books/dragon/tea 25, map/dice 34, vines 42 pixels at 100% intensity. Default 75%. Vertical travel is 65% of horizontal travel. CSS sizes include overscan. Text and navigation remain still.

Pointer tracking uses an interruptible damped spring and stops rendering when settled. Leaving the hero returns to center. Touch and reduced-motion preferences disable parallax; hiding the tab or scrolling offscreen resets it. Controls support keyboard use.

This is a composition test using full-resolution source PNGs. Before production, export appropriately sized WebP/AVIF variants and integrate real category/story links. All three sample audience links currently open the shop. No WordPress or production files changed.

Pointer focus samples small alpha masks to identify the foremost visible object under the cursor, ignoring transparent margins. Its depth plane becomes sharp while other layers smoothly defocus (maximum 5px blur, with a 3-unit sharp band). Leaving the hero clears blur; pause, touch, reduced motion, and hidden/offscreen states remain sharp. Focus is independent of the parallax strength slider. CSS filter animation is intentional for this requested optical effect; assess GPU cost with final production-sized assets.

## Firelight composite
Moonlit mode now uses `08-midground-workshop-midnight.png` underneath eight elliptical, feathered patches of the warm `05` render. Each patch crops a registered full-image exposure, preserving the material lighting. Static brightness/saturation filters and screened, blurred halos add bloom; only patch opacity animates, with separate timing/phase per source. All patches inherit workshop parallax and focal blur. Pause, reduced motion, hidden tabs and offscreen states stop the flicker. Sunlit mode hides the composite beneath the daylight render.

The visual animation cadence is capped at 12fps: spring/focus display writes are throttled to 83.3ms, and firelight opacity is sampled on an 83.3ms timer. Spring integration remains continuous internally for stability. Room-toggle crossfades remain normal UI transitions. Background tabs/offscreen/paused states stop the lighting timer.

Hover magic: alpha-aware pointer selection of the workshop depth plane gradually raises lantern exposure and reveals a broad feathered warm interior overlay. Foreground objects occlude this interaction. Leaving the workshop fades the warmth; updates share the 12fps lighting clock. Pause/reduced motion/offscreen states clear the hover glow.

Vines use a 16×12 textured WebGL triangle lattice with pinned upper edge and lower corners, spring-restoring forces, neighbor coupling, gentle wind and local pointer pressure. Physics substeps run inside each 12fps render tick. The entire mesh still inherits layer parallax and focal blur. Pause, reduced motion, coarse pointer, offscreen and hidden states reset the lattice and stop its timer. Original PNG is retained for WebGL/image-loading failure. No dependencies.

## Split dragon and foreground
The foreground now uses dark props `12` plus a lantern-centered masked exposure of warm props `11`. Hovering the foreground raises its warm exposure; flicker continues at 12fps. The separate body `10` is positioned over the books and wing render `09` is skinned behind it using a 24×16 textured triangle mesh. A shoulder rotation and blended elbow rotation flex the near membrane; the far wing uses a smaller phase-delayed rotation. All share the foreground parallax/focus plane. Alpha focus selection includes the resting dragon silhouette (moving wing-tip hit testing is approximate). Pause/reduced motion/offscreen/hidden states stop and reset the rig. The body remains still for this first wing-only animation study.

### Wing rendering correction
The shared deforming mesh is replaced by two independently masked canvas sprites, each with its own fixed shoulder pivot. This removes the discontinuous bone weights and connecting triangles between wings. Added transparent canvas overscan to avoid clipping flap extremes. An authored 16-pose cycle adds anticipation, a faster downstroke, and slower recovery, with a one-pose far-wing delay. Each pose holds for two ticks of the existing 12fps scene clock (6 unique poses/sec; traditional 24fps-on-twos would be 12 poses/sec). Reduced motion and pause restore the resting pose. Source PNG remains the fallback; masks are runtime layers, not new generated assets.

### Body motion and blink
Large near wing is now a separate foreground sibling (z=3), body mesh sits at z=2, far wing at z=1. The body uses a 28×20 textured WebGL lattice with small localized chest, head and tail deformations; the paw contact line is held still. Two eye-region shader masks reveal sampled scale texture as eyelids for a short blink every 7.5 seconds. This is a procedural blink approximation using the existing artwork. Body updates share the wing pose clock (6 held poses/sec). Rest states clear the mesh offsets and reopen the eyes; the source image remains the rendering fallback.

Wings rest for 12 seconds between small idle flexes (16% amplitude). Clicking visible wing pixels, or the keyboard-accessible Flap wings control, triggers one strong flap (190% amplitude), then restores rest. Repeated clicks during a flap do not restart it. Body breathing/blinking continues independently while wings rest. Pause/reduced motion disables the interaction.

Lake motion uses a WebGL texture-refraction pass with four feathered, conservatively traced water pockets. Horizontal displacement increases toward the foreground; highlight shimmer is luminance-weighted. Outside the mask the original texture is returned unchanged. Runs at 12fps and inherits landscape parallax/focus. Pause, reduced motion, hidden tabs and offscreen states stop updates and restore the original exposure. Source PNG is the fallback.

Hero CTAs use translucent glass shells with backdrop blur, edge highlights and a clipped canvas bubble simulation. Fourteen buoyant particles per button drift upward, respond to pointer proximity, bounce off side walls and respawn at the base. Labels remain above the particles, original anchor behavior is preserved, and decorative canvases are hidden from accessibility APIs. Updates run at 12fps; pause, reduced motion, offscreen and hidden states stop the simulation.

Click open sky to launch three staggered shooting stars. Hit testing requires the background depth plane and sky coordinates; links and foreground objects do not trigger bursts. Stars render inside the landscape layer behind scenery, clip above the mountain line, share its parallax/focus, and update at 12fps only while alive. Bursts cap at 18 particles. Shooting stars control provides keyboard access. Pause/reduced motion/offscreen/hidden states clear the effect.

## Current cadence: 24fps
All animation renderers now target 24 updates/sec, superseding the earlier 12fps/twos notes. Dragon poses interpolate between the authored keys so flap duration and 12-second idle intervals stay unchanged. Vine physics substeps, bubble/star velocities, water time and light easing were adjusted to preserve their speeds. Castle text uses six steps over 250ms; room crossfades use fifteen steps over 625ms.
