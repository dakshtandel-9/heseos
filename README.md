# Heseos — website frontend

The Heseos e-commerce site, designed in an Apple-inspired direction: a story-led homepage, the Heseos Simulation, product pages, a store with Smart Packages, and a bag.

## Run locally

Use Node 22.13 or newer.

```sh
npm install
npm run db:migrate
npm run dev
```

## Routes

| Area | Routes |
|---|---|
| Story | `/` homepage · `/experience` the simulation |
| Products | `/products` (all products, search) · `/products/[category]` · `/products/[category]/[range]` (filters) · `/products/[category]/[range]/[product]` (configurator, quote request) |
| Product stories | `/products/touch-panel` · `/products/ir-blaster` · `/products/smart-plug` |
| Store | `/store` · `/store/buy/[product]` · `/packages` · `/compare` · `/build` · `/bag` · `/checkout` |
| More | `/app` · `/demo` |
| Placeholders | `/about` · `/projects` · `/blog` · `/support` |

`/apartment` and `/apartment2` redirect to the Apartment 2 simulation.

## The Heseos Simulation (`/experience`)

- Apartment 2 is the only simulation home (`app/components/simulation/ApartmentViewer.tsx`, `lib/apartments.ts`): 5 rooms with baked/unlit materials in a 0.6 MB model.
- Native page scrolling moves a viewport-height sticky scene through interactive lighting, TV and AC moments, followed by all 15 catalogue ranges and their 37 product families. Scroll progress continuously eases the camera toward each device and across room viewpoints. The site header appears before the tour and the footer follows it. Product cards use catalogue imagery and open the matching product page.
- Three components, each driving one illustrative load from `lib/energy.ts`: Touch Panel → lighting, IR Blaster → AC, Smart Plug → TV and set-top box (`lib/devices.ts`). Device and appliance models are procedural stand-ins (`lib/device-models.ts`) until approved product GLBs exist.
- Wall and surface devices snap onto the real geometry after load (`mount` in `lib/apartments.ts`). `?debug` shows a top-down plan with a 1 m grid for placing them; `?device=<slug>` opens a component directly.
- Scenes (Home, Evening, Away), a connected-load meter, typed and voice commands (voice is off until enabled), an app preview, and HTML controls that keep working without WebGL.

## Data and claims

- The brochure catalogue lives in `data/products.json`: 5 source categories, 15 ranges, 37 product families and 106 configurations, with specs, options, filters and FAQs. The `/products` collection reorganizes these into 8 visible categories, 14 subcategories and 40 product types in `lib/product-directory.ts`. The brochure pages use this source data; run `npm run test:products` after source edits. The managed shop uses the separate database-backed catalog in `/admin`. `review` notes on a record list what the brochure leaves unclear; they are never shown on the site. Set `meta.contact.whatsapp` to show WhatsApp enquiry buttons.
- Product copy, prices and package contents come from heseos.com (`lib/catalog.ts` notes the pages and the fetch date). Touch panels are sold only in packages, as on heseos.com.
- Watts are illustrative example loads. Pages footnote every figure.
- Checkout saves unpaid order requests; demo, quote, support and newsletter forms save submissions to the admin database. Online payment collection is not connected.

## Media

- `public/media/products`: official product photos from heseos.com, cropped and converted to WebP. `touch-4m-face.webp` is `touch-4m.webp`'s glass flattened to a straight-on view, the face texture of the homepage's 3D Touch Panel; `public/media/home/gen/touch-demo-room.webp` is a crop of `gen/hero.webp` for its touch demo.
- `public/media/products/studio`: 40 generated studio renders used for directory cards and as lead images on product pages. Product detail galleries also show brochure and model-specific images from `public/media/catalog`. The original crop library is backed up at `output/source-brochure-crops`. All imagery is illustrative; Heseos should confirm finishes and configurations.
- `public/media/clients`: client and exclusive-partner logos from brochure page 68. `public/media/home/smart-home-cutaway.webp`, `solution-*.webp` and `cta-home.webp` are also brochure crops (pages 2–3, 6 and 67). Homepage copy lives in `lib/home.ts`; contact details, social profiles and app store links in `lib/site.ts`.
- `public/media/home`: stills and films rendered from the simulation itself (hero film, highlights, solutions, teaser).
- `public/media/home/journey`: 5:4 crops for the homepage's How it works steps. All four are AI-generated with Higgsfield (GPT Image 2.5, medium quality, 1120×896), using `products/touch-4m.webp` and `products/app-phone.webp` as references so the Touch Panel and app match the real ones. Stand-ins until real consultation, planning and installation photography arrives.
- `public/media/models`: compressed apartments. `npm run model:compress` rebuilds them from the original GLBs at the repository root (`../modern_apartment.glb`, `../appartement.glb`). Both originals are Sketchfab exports; confirm their licences before public launch.
- `public/media/draco`: three.js's glTF Draco decoder, served as static files for the decoder worker.

## Checks

```sh
npm run check
npm run lint
npm run test:energy
npm run test:catalog
npm run test:products
npm run test:voice
npm run build
```

`test:catalog` covers package data, bag lines, the build-your-home recommendation, simulation commands and apartment configuration.

## Store admin and local commerce

The private admin lives at `/admin`. The first time its database is initialized, the starting password is `1210`. In production, set `ADMIN_INITIAL_PASSWORD` as a secret before the first database initialization to choose a different initial password. Admin sessions last eight hours; a password change revokes them all. Change the initial password promptly in **Settings**. Products, orders, enquiry and newsletter submissions, customer order summaries, stock, activity, and CSV reports live in a Turso (SQLite) database. Uploaded product images live in Vercel Blob.

The Store navigation now opens the managed catalog at `/shop`. New active products from admin appear there; leave the price blank to collect quote requests or set a selling price to accept unpaid order requests. Checkout validates the product price and stock on the server, makes each submission idempotent, and reserves tracked stock. Cancelling an order releases that stock. Record a payment in Orders after confirming receipt; sales reports count only orders marked **paid**. Razorpay and automated email delivery are not connected. Demo booking, product enquiries, support messages, and newsletter subscriptions are recorded in Admin → Form submissions.

On Vercel, add the **Turso** integration (sets `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`) and a **Blob** store (Private) to the project. The tables in `drizzle/*.sql` are created automatically on first use (`lib/admin/database.ts`); add later migrations there as idempotent `IF NOT EXISTS` statements. Without `TURSO_DATABASE_URL`, local runs use a SQLite file at `.data/local.db`.
