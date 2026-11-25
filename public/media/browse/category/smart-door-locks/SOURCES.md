# Smart Door Locks media

- `explode.mp4`, `explode-720.mp4`, `explode-poster.webp`, `explode-open.webp`: the hero's exploded-view film of the Wooden Door Lock, generated (illustrative).
  - Keyframes: Higgsfield GPT Image 2.6 (1K, 16:9). Exploded (high): an edit of Heseos's own "SS304 Stainless Steel" product artwork with the text, flames and rocks removed, so the parts and the HESEOS logo are the real ones. Assembled (medium): an edit of the exploded keyframe with the same camera.
  - Film: Kling 3.0 std, 4 s, sound off, assembled keyframe as the start frame and exploded keyframe as the end frame.
  - Scrubbed by scroll (`ExplodeFilm.tsx`): H.264, a keyframe every 4 frames, no B-frames (CRF 20 at 1280 px, CRF 25 at 1024 px), faststart, no audio.
  - `explode-poster.webp` is the first frame (assembled); `explode-open.webp` is the last frame (exploded), shown with reduced motion. Pin positions in `stories.ts` are measured on it.
- `home.mp4`, `home-720.mp4`, `home-poster.webp`, `home-end.webp`: the "Coming home" film (a woman unlocks the door with her fingerprint and walks in), generated (illustrative).
  - Start frame: GPT Image 2.6 (high, 2K, 16:9), an edit of an earlier 1K start frame with the lock shrunk to a realistic size (lever at waist height), the SS304 artwork as the lock reference.
  - Film: Kling 3.0 Pro (1912×1080), 5 s, sound off, image-to-video, static camera. Checked frame by frame: no invented signs or text (an earlier std take with a moving camera invented a misspelled "HESOS" plaque).
  - Same scrub encoding as above, scaled to 1920×1080 (CRF 21) and 1280×720 (CRF 22). `home-poster.webp` is the first frame; `home-end.webp` the last, shown with reduced motion.
- `hero.webp`, `entrance-away.webp`, `entrance-home.webp`: the previous hero still and day/night scene. No longer used on the page.
