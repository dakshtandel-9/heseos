# Smart Switches & Panels media

- `explode.mp4`, `explode-720.mp4`, `explode-poster.webp`, `explode-open.webp`: the hero's exploded-view film of the Three Phase Energy Meter, generated (illustrative).
  - Keyframes: Higgsfield GPT Image 2.6 (high, 2K, 16:9). Closed: from the supplied open-lid product photo of the meter. Exploded: an edit of the closed keyframe, with the same photo as the reference for the circuit board.
  - Film: Kling 3.0 Pro, 6 s, sound off, closed keyframe as the start frame and the exploded keyframe as the end frame.
  - Scrubbed by scroll (`ExplodeFilm.tsx`), so it is the forward clip only, re-encoded with H.264, a keyframe every 4 frames and no B-frames (CRF 22 at 1080p, CRF 24 at 720p), faststart, no audio.
  - `explode-poster.webp` is the first frame (closed); `explode-open.webp` is the last frame (exploded), shown with reduced motion. Pin positions in `stories.ts` are measured on it.
- `room-day.webp`, `room-night.webp`, `touch.webp`, `lineup.webp`: story scenes, generated (illustrative) with Higgsfield GPT Image 2.6 (high, 2K) from the Edge Panel Series studio shot (`/media/products/studio/edge-panel-series.webp`), so they show the real horizontal panel. Day: the previous room scene as the layout reference with the panel swapped in. Night: an edit of the new day image. Touch: a 16:9 close-up, square-cropped. Lineup: 21:9, four sizes (2, 4, 8 and 12 keys).
- `hero.webp`: the previous hero still. No longer used on the page.
