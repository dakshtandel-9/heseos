# Homepage app showcase assets

Retrieved 2026-11-02. Keep both badge files unmodified.

- `app-store.svg`: https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg
  - Guidelines: https://developer.apple.com/app-store/marketing/guidelines/
  - Preferred black artwork, first in the lineup; at least 40px high with quarter-height clear space.
- `google-play.png`: https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png
  - Official resources: https://play.google.com/intl/en_us/badges/
  - Includes transparent clear space; CSS matches the visible badge height without cropping or altering the file.

Verified destinations (existing `APPS` constants in `lib/site.ts`):

- https://apps.apple.com/us/app/heseos/id6443842270 — HESEOS, developer support at heseos.com.
- https://play.google.com/store/apps/details?id=com.heseos.smart — HESEOS, developer website heseos.com.

The original `/media/products/app-phone.webp` is the only local app interface image. Controls and power previews highlight regions of that same image; they do not simulate switching devices or invent screens. The enlarged view reuses the same asset. The lifestyle photograph is unchanged.

The notification retains the existing “Front door locked / Away scene is on” example and is explicitly labeled a demonstration. Access alerts are supported in `data/products.json` (wooden-door-lock). Voice compatibility and the other six features are documented in that existing catalogue; the store descriptions also confirm remote controls, scenes, power analytics, Alexa and Google Assistant. No live device requests are made.

## App landing page additions (2026-11-03)

- `smart-living.webp`: generated warm contemporary evening living room for the lifestyle section and security illustration.
- `remote-access.webp`: generated photo of a person using a phone away from home; its screen is deliberately blank.
- `phone-stage.webp`: generated neutral architectural backdrop for the genuine app phone asset.

The three source PNGs remain in the local Codex generated-images directory. These WebP files were resized to a maximum width of 1800px and optimized for the page. The hero, feature device card and interactive walkthrough all reuse the authentic `/media/products/app-phone.webp` rather than a generated app interface. The final CTA reuses `/media/home/gen/cta-night.webp`.

## Partner & Installer sections (2026-11-24)
Generated with Higgsfield GPT Image 2.6 (high, 2K, 2 credits each, 8 total), using `/media/products/studio/touch-panel-series.webp` as the product reference. Resized to 1600px WebP.
- `installer-site.webp`: an electrician wiring a glass touch panel in a finished home (Installer section lead photo).
- `installer-hands.webp`: close view of hands fitting the panel, tool pouch and phone nearby (Installer detail).
- `partner-studio.webp`: a designer showing a phone to a homeowner couple over floor plans and swatches (Partner section lead photo).
- `partner-site.webp`: an architect showing homeowners a mounted panel at a villa site visit (Partner detail).
- `icons/{customer,partner,installer}.png`: the three real app icons, cropped from a device home-screen screenshot.
