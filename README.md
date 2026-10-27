# Heseos — website frontend

The Heseos e-commerce site, designed in an Apple-inspired direction: a story-led homepage, the Heseos Simulation, product pages, a store with Smart Packages, and a bag. The earlier Saving Power story is preserved at `/saving-power`.

## Run locally

Use Node 22.13 or newer.

```sh
npm install
npm run dev
```

## Routes

| Area | Routes |
|---|---|
| Story | `/` homepage · `/experience` the simulation · `/saving-power` the original story |
| Products | `/products` · `/products/touch-panel` · `/products/ir-blaster` · `/products/smart-plug` |
| Store | `/store` · `/store/buy/[product]` · `/packages` · `/compare` · `/build` · `/bag` · `/checkout` |
| More | `/solutions` and `/solutions/[home,hotel,buildings,enterprise]` · `/app` · `/demo` |
| Placeholders | `/about` · `/projects` · `/blog` · `/support` |

`/apartment` and `/apartment2` redirect to the simulation with that apartment selected.

## The Heseos Simulation (`/experience`)

- Two apartments behind one config-driven viewer (`app/components/simulation/ApartmentViewer.tsx`, `lib/apartments.ts`): Apartment 1 (8 rooms, lit PBR materials, 11.2 MB) and Apartment 2 (5 rooms, baked/unlit materials, 0.6 MB, loads first).
- Three components, each driving one illustrative load from `lib/energy.ts`: Touch Panel → lighting, IR Blaster → AC, Smart Plug → TV and set-top box (`lib/devices.ts`). Device and appliance models are procedural stand-ins (`lib/device-models.ts`) until approved product GLBs exist.
- Wall and surface devices snap onto the real geometry after load (`mount` in `lib/apartments.ts`). `?debug` shows a top-down plan with a 1 m grid for placing them; `?device=<slug>` opens a component directly.
- Scenes (Home, Evening, Away), a connected-load meter, typed and voice commands (voice is off until enabled), an app preview, and HTML controls that keep working without WebGL.

## Data and claims

- Product copy, prices and package contents come from heseos.com (`lib/catalog.ts` notes the pages and the fetch date). Touch panels are sold only in packages, as on heseos.com.
- Watts are illustrative example loads. Pages footnote every figure.
- Checkout and demo booking are UI only: payment and lead capture are not connected, and both pages say so.

## Media

- `public/media/products`: official product photos from heseos.com, cropped and converted to WebP.
- `public/media/home`: stills and films rendered from the simulation itself (hero film, highlights, solutions, teaser).
- `public/media/models`: compressed apartments. `npm run model:compress` rebuilds them from the original GLBs at the repository root (`../modern_apartment.glb`, `../appartement.glb`). Both originals are Sketchfab exports; confirm their licences before public launch.
- `public/media/draco`: three.js's glTF Draco decoder, served as static files for the decoder worker.

## Checks

```sh
npm run check
npm run lint
npm run test:energy
npm run test:catalog
npm run test:voice
npm run build
```

`test:catalog` covers package data, bag lines, the build-your-home recommendation, simulation commands and apartment configuration.

## Saving Power story (`/saving-power`)

An interactive 3D home tour based on the supplied Heseos storytelling proposal. Scroll through five camera stops: whole home, living-room lighting, bedroom AC, entertainment standby, and Away mode. Click device hotspots, use the chapter switches, or enable the voice assistant in the header. The microphone is off by default and stays enabled only after manual activation, until switched off. Typed commands work when speech recognition is unavailable. Device states persist across camera stops. Replay/Home restores the initial loads.

### Assets and scope

- The house is actual 3D geometry: three floors, rooftop pavilion, nine furnished bays, car, stairs and planting. `public/assets/heseos-home.glb` is 2.28 MB with 235 meshes and 85,220 triangles.
- `npm run model:build` rebuilds the original local model. The model was reconstructed from the PDF; it is not a dimensionally certified building or manufacturer CAD file.
- Product faces use the original imagery extracted from PDF page 8 through projective UV mapping. The lower-page room image is the original PDF image from page 6.
- Product catalogue and capability sources: https://heseos.com/product-info/2m-touch and https://www.heseos.com/product-info/4-switch . Catalogue button layouts differ from the proposal concept visuals. The demo prioritizes the supplied PDF's product faces.
- Loads (120 W lighting, 1,200 W climate, 80 W standby) are explicit examples. Avoided energy is `(1400 - current load) × unused hours / 1000` kWh; no savings percentage or measured consumption is claimed.
- Lighting controls affect every room, lamp, strip, stair and exterior light in the 3D home. The All lights control is available at every camera stop. Dimming also applies across the whole home. Climate airflow and TV materials respond independently.
- Voice uses continuous browser speech recognition, enabled only by the header microphone button. The browser's provider may process speech. This application does not record/store audio or collect leads. There is no floating assistant. Tapping the mic switches listening off or on directly; there is no voice dialog. Listening resumes after silence and recoverable disconnects, pauses while the page is hidden, and stops retrying after permission errors. Spoken replies are on by default: after manual activation, the assistant says “Welcome to Heseos.” and confirms light changes with “Your lights are on/off.” The microphone pauses during spoken replies to avoid hearing its own commands. Visitors can mute replies separately. HTTPS or localhost and browser microphone permission are required; browsers may also require a first click to enable speech. Spoken replies stay silent while the assistant is off. Typed commands remain available in the voice section.
- The demo does not connect to physical Heseos hardware. That requires a separate authorized Heseos API integration.
- Reduced motion uses stable camera stops; unsupported WebGL has an image fallback with usable HTML controls.

### Heseos brand refresh

The header/footer use the official transparent white logo from https://www.heseos.com/static/logo-white.png. Interface colors follow the existing site: black, #161616, #f05a28 and the #faa43d / #ee5b25 button gradient. The original house GLB and PDF product imagery are retained.

The hero canvas covers the entire viewport. Responsive camera framing fits the complete home or selected room inside an area clear of headings and controls; 120 projection checks cover eight screen sizes and three rotations. Navigation is fixed, with a collapsible mobile menu.

#### Opening loader

The initial server-rendered screen is opaque black with a 1–100% progress indicator. The page stays inert and visually hidden while all page images (including off-screen product imagery), fonts, the complete GLB, and its textures load and decode. Progress follows completed image tasks and model transfer; 100% requires the first complete 3D frame. After a short 100% hold, the page appears with the voice assistant off until manually enabled in the header. Asset failures or a 90-second loading timeout keep the page covered and offer a reload; the loader never releases an incomplete model.
