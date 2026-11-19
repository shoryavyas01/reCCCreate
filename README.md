# ReCCCreate

A student venture at Dharav High School, Bhankrota, Jaipur, turning temple flowers into rangoli colour and compost. The production website is https://re-cc-create.vercel.app/ until a custom domain is connected.

## Run and verify

```bash
npm ci
npm run dev
```

For a release:

```bash
npm run lint
npm run check:forms
npm run build
npm run check:release
npm audit
```

`check:forms` uses mocked delivery providers and never sends a real message. `check:release` starts the production build on port 3199 and verifies public pages, links, image files, metadata, policies, safe invalid API submissions, a real 404, and retired URL redirects.

## Public pages

Home, Our story/process/team, Shop, Phool Mitra and Contact. Policies are available at `/privacy`, `/terms` and `/returns` and linked in every footer and the relevant forms. Public tracing and QR generation are removed. Previous `/trace` URLs permanently redirect to the shop so older printed links do not lead to a broken page.

The homepage publishes the team-supplied totals of 467 kg of flowers collected/recycled and 560 rangoli colour packets. These figures are maintained in `src/lib/impact.ts` and are separate from internal batch records.

## Product catalogue

`src/lib/catalogue.ts` supplies the three branded products, stable product slugs, ingredients and packaging images. Kesar Kyari and Sunheri Subah rangoli colours have MRP ₹20; Temple Bloom flower compost has MRP ₹50. The Kesar Kyari back label has a corrected ₹20 asset with a new filename. Details of the pack pictured are not a promise that every future pack has the same manufacturing date.

Without a database, the site uses the published catalogue. When a configured catalogue fails to load, the public site remains usable with this fallback. Internal database IDs and the legacy `gulaal` category key remain compatible with existing records; public copy uses rangoli colour. The known branded product prices follow the published catalogue.

## Forms and the existing Google Sheet

Copy `.env.example` to `.env.local` for local development. Never commit real environment values. In Vercel, set the server-only variables in Production and redeploy after changes:

- `PHOOL_MITRA_SCRIPT_URL`: the deployed Apps Script web app address ending in `/exec`.
- `PHOOL_MITRA_SECRET`: the existing shared secret, matching the `SHARED_SECRET` Apps Script property.

The Google script must be version 3 or later to support all three forms. `google-apps-script/website-forms.gs` is its source. Deploy script changes with **Manage deployments > Edit > New version** so the endpoint remains unchanged. No new script deployment is needed for this website release if version 3 is already installed.

| Form | Sheet tab | Website behaviour |
| --- | --- | --- |
| Contact | Contact | Selecting Buying reveals a required product selector. Product and current MRP appear in the About column and email draft, preserving the complete Message column. |
| Phool Mitra | Sign-ups | Collects the contact and locality details needed to coordinate participation. |
| Shop order request | Orders | Product, price and total are validated from the server catalogue; browser-supplied prices are ignored. |

Each form requires acknowledgement of the privacy notice. Requests for children should be submitted by a parent or guardian using their own contact details. An acknowledgement confirms receipt of a request, not acceptance of an order or payment. The website does not take online payment.

All API routes reject cross-origin browser requests, malformed or oversized JSON, invalid fields and filled honeypots. Form submissions are not automatically retried because a lost response can follow a successful save. Errors preserve the visitor’s input and direct them to contact the team before resubmitting. No setup secrets are returned in API errors. Contact offers a reviewable email draft if delivery is unavailable or cannot be confirmed.

## Private administration

Supabase is optional for the public catalogue. For administration, configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Apply `supabase/schema.sql` in the project SQL editor and explicitly authorise accounts in the `admins` table. Do not expose a service-role key to the browser. `/admin` is excluded from indexing, and database row-level policies enforce administration rights. Collection and batch records remain internal; public tracing is retired.

## SEO and a custom domain

- Public pages have unique titles/descriptions, canonical URLs, Open Graph and Twitter metadata.
- `/sitemap.xml` contains the eight public pages, with private admin/API pages excluded.
- `/robots.txt` excludes admin/API crawling. Preview deployments are marked noindex.
- Organisation/website structured data uses known project facts; it contains no invented ratings, legal registration or sales claims.
- Social assets are in `public/social/`; icons are in `public/`.
- `NEXT_PUBLIC_SITE_URL` should be the final public HTTPS origin, without a path. Invalid or localhost values fall back to the current live Vercel address.

After the owner provides the purchased domain name, add it and the chosen `www` variant to the existing Vercel project. Use the exact DNS records supplied by Vercel at GoDaddy, preserve mail-related DNS records, verify DNS/HTTPS, set the canonical origin, and redeploy. A production domain must be verified before changing the canonical origin. Search Console ownership and sitemap submission require the owner’s Google account; this release does not claim to have completed them.

## Policies and owner information

Policy pages describe the present enquiry/order-request workflow, local delivery by arrangement, product-use guidance, cancellations, defective/wrong products, refunds, privacy requests and statutory-rights preservation. They do not invent a registered company name, commercial street address, GST number, grievance officer or fulfilment deadlines.

Before presenting the project as a fully operational commercial seller, the owner should confirm the responsible legal seller/adult supervisor, applicable business and grievance contact details, actual pack declarations and fulfilment arrangements. Update the policies/contact details to reflect those confirmed facts. The published project email is `recccreate@gmail.com`, transcribed from the supplied product label; the team should ensure it is monitored.

## Images and credits

- Product, process and team photos were supplied by the project team. Team names/photos are in `src/lib/team.ts` and `public/images/team/`.
- Jharkhand Mahadev Mandir: official temple website photograph, https://jharkhandmahadev.in/jkmadmin/uploads/banners/1551519133.jpg. The card links to the temple website.
- Shri Radha Gopinath Ji Temple: Anildiggiwal, 8 May 2025, CC0, https://commons.wikimedia.org/wiki/File:Shri_Radha_Gopinath_Ji_Temple_Jaipur.jpg. Linked attribution is visible on the card.
- Shiv Mandir, Rangoli Road: a representative generated Shiva shrine illustration, visibly labelled as AI-generated; it is not a documentary image of the named site. Replace it when a verified photograph is available.
- Hero artwork is labelled illustrative. Fonts are bundled with their SIL Open Font Licences in `public/fonts/`.
