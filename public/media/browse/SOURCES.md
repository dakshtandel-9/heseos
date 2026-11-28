# Product range (subcategory) hero imagery

Generated 2026-11-04 with Higgsfield (`gpt_image_2_5`, 1344×752, not upscaled) for `/products/browse/[category]/[subcategory]`.
One per directory subcategory, named by its slug; alt text lives in `lib/directory-media.ts`. All are illustrative and captioned as such.

The devices shown are generic stand-ins, not Heseos products. Product photos on these pages stay the brochure images in
`data/products.json`, and the "More in…" cards reuse the existing `/media/products-page/*.webp` range images.

## Category heroes (`category/`)

Eight more, one per directory category (`category/<category-slug>.webp`), generated the same way for `/products/browse/[category]`;
alt text is in `CATEGORY_HEROES` in `lib/directory-media.ts`. They also illustrate the "Explore other categories" cards.

## Closing banners (`banner/`)

Eight more, one per directory category (`banner/<category-slug>.webp`), for the call-to-action banner at the foot of each
category page and its range pages (`CATEGORY_BANNERS` in `lib/directory-media.ts`). Decorative, so they carry empty alt text.

- touch-panels.webp, category/smart-switches-panels.webp — regenerated 2026-11-27 with GPT Image 2.6 (Higgsfield), edits of the previous images using products/touch-4m.webp as the product reference. Illustrative.
- touch-panels.webp and banner/smart-switches-panels.webp — regenerated 2026-11-28 with GPT Image 2.6 (Higgsfield, high, 2K, 16:9), edits of the previous images using products/studio/edge-panel-series.webp as the product reference, so both show the real horizontal Edge Panel (the banner previously showed an off-brand vertical switch). The tilted logo the model draws is replaced locally with the upright mark from /assets/heseos-logo-white.png. Saved at 1920x1086. Illustrative.
- modular-switches.webp — regenerated 2026-11-28 with GPT Image 2.6 (Higgsfield, high, 2K, 16:9), an edit of the previous image using products/studio/smart-modular-switch.webp as the product reference: the generic white switches are replaced by the two Smart Modular Switch glass modules in a white plate. Saved at 1920x1086. Illustrative.
- retrofit-modules-v3.webp — regenerated 2026-11-28 with GPT Image 2.6 (Higgsfield, high, 2K, 16:9) using products/studio/smart-retrofit-module.webp as the product reference: an electrician fitting the HESEOS retrofit module into the back-box behind an existing four-switch board. Then edited (GPT Image 2.6, same settings) to remove a pendant lamp and clean up the wall, box, plate and wiring. Saved at 2400x1357. Illustrative.
- screen-control-panels-v2.webp, premium-glass-touch-switches-v2.webp — 2026-11-28, GPT Image 2.6 (Higgsfield, high, 2K, 16:9), edits of the previous heroes using the products/studio shots as references (premium: a 2x2 sheet of the four). Illustrative.
- modular-switches-v2.webp, touch-panels-v2.webp — the 2026-11-28 regenerations saved under new names so the Next.js image cache serves them. Use a new name whenever a hero is replaced.

- `digital-door-locks-v3.webp`, `banner/smart-door-locks-v3.webp` (generated, illustrative): Higgsfield GPT Image 2.6 (high, 2K, 16:9) edits of the earlier stills, with the lock replaced using the HESEOS lock (with logo) from `category/smart-door-locks/explode-poster.webp` as reference.
  The v3 stills redo these at a realistic lock size; the mortise bolts drawn on the closed door in the hero were retouched out locally.

- `smart-plugs.webp`: regenerated 2026-11-28, Higgsfield gpt_image_2_6 job b7006587-ae37-4335-872e-706b34a8cd77 (ref: products/studio/wi-fi-smart-plug.webp), 2 credits. Illustrative.
- `energy-meters.webp`: regenerated 2026-11-28, Higgsfield gpt_image_2_6 job 843914d8-bcbe-4734-8628-e0d9413b37ec (ref: products/studio/three-phase-energy-meter.webp), 2 credits. Illustrative.
