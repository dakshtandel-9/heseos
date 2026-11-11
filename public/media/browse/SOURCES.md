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
