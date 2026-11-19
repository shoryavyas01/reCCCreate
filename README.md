# ReCCCreate

*CCC stands for Credit. Community. Change.*

Website for a student venture at Dharav High School, Bhankrota, Jaipur, that collects flowers offered at Jaipur temples and turns them into rangoli colour and compost. Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase and Web3Forms.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without keys the site shows the published product catalogue, project temple names and packaging-based trace records. The contact form prepares an email draft for the visitor to review and send. Direct contact submission uses the existing Google Sheet connection below; it saves messages to the Contact tab. A draft is never reported as a delivered message.

## Connect the services

Copy `.env.example` to `.env.local` and fill it in. Never commit `.env.local`.

### 1. Web3Forms (shop order form)

1. Go to web3forms.com and create an access key using the email that should receive messages (a shared team Gmail that forwards to every member is best).
2. Put the key in `NEXT_PUBLIC_WEB3FORMS_KEY`.

### 2. Supabase (data and admin login)

1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, and run it. This creates the tables, the row-level security rules and the photo bucket.
3. In **Project Settings > API**, copy the project URL and the anon key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. In **Authentication > Sign In / Providers**, turn off "Allow new users to sign up" so nobody can register themselves.
5. In **Authentication > Users**, click **Add user** and create each admin with an email and password.
6. Make each of them an admin. In the SQL Editor run this, once per admin email:

   ```sql
   insert into admins (user_id) select id from auth.users where email = 'admin@example.com';
   ```

Sign in at `/admin`. Only accounts in the `admins` table can sign in or change data; the database itself enforces this.

### 3. Google Sheet (Phool Mitra sign-ups and Contact Us messages)

Each sign-up on `/phool-mitra` becomes a row in the **Sign-ups** tab (Timestamp, Name, Phone, Area/Locality, Nearest Temple(s), Collection Frequency), and each message on `/contact` becomes a row in the **Contact** tab (Timestamp, Name, Email, Phone, I am a, About, Message). The browser sends each form to the site's own API route (`/api/phool-mitra` or `/api/contact`), which checks it and passes it to a Google Apps Script attached to the sheet. The script address and secret stay on the server, so visitors never see them.

1. Create a Google Sheet (for example "Phool Mitra sign-ups") with the team's Google account.
2. In the sheet, open **Extensions > Apps Script**. Delete the sample code, paste in all of `google-apps-script/website-forms.gs`, and save.
3. Make up a long random secret (for example, run `openssl rand -hex 24` in Terminal). In Apps Script, open **Project Settings** (gear icon) > **Script properties** > **Add script property**, name it `SHARED_SECRET`, and paste the secret as its value.
4. Click **Deploy > New deployment**, choose type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then click **Deploy**. Approve the permission prompt with the team account. Copy the web app URL, which ends in `/exec`.
5. Put the URL in `PHOOL_MITRA_SCRIPT_URL` and the secret in `PHOOL_MITRA_SECRET`, in `.env.local` and in Vercel (**Settings > Environment Variables**), then redeploy. Until both are set, sign-ups show an unavailable notice and the contact form offers an email draft instead.

Each tab is created with its header row the first time that form is used. Before saving a Contact message, the site checks the script is version 2 or later, so an old copy of the script can never put messages in the Sign-ups tab. "Anyone" access is needed for the site to reach the script; the secret is what stops anyone else adding rows. If you change the script later, use **Deploy > Manage deployments > Edit > New version**, so the URL stays the same.

## Where to change things

| What | Where |
|---|---|
| Temples, collections, batches, products | `/admin` |
| Phool Mitra sign-ups | The Google Sheet (see above) |
| Phool Mitra page text and steps | `src/app/phool-mitra/page.tsx` |
| Homepage artwork and illustration labels | Hero `Image` and caption in `src/app/page.tsx` |
| Team names and process descriptions | `src/lib/team.ts` and `steps` in `src/app/about/page.tsx` |
| Floral illustrations | `src/components/BotanicalMotif.tsx` |
| Official logo in the header and footer | `public/brand/recccreate-logo.png` and `src/components/BrandLogo.tsx` |
| Colours and type sizes | `src/app/globals.css` |
| Bundled fonts (Montserrat and DM Serif Display) | `public/fonts` and `src/app/layout.tsx` |
| Database tables and security rules | `supabase/schema.sql` |

## Published impact figures

The homepage uses the team-supplied totals in `src/lib/impact.ts`: **467 kg of flowers collected and recycled** and **560 rangoli colour packets**, updated 19 November 2026. Update that file when the team publishes new totals. Packet counts are separate from batch kilograms; the homepage does not convert one to the other or estimate an annual total.

Product labels now say rangoli colour. Existing database category keys and saved product IDs remain compatible; display names are normalized in `src/lib/products.ts`, including names returned for batch tracing. Supabase collection and batch records remain separate from the published impact snapshot.

## QR codes

In `/admin` > Batches, each batch has a **QR code** button that downloads a PNG linking to `/trace/<batch id>`. Set `NEXT_PUBLIC_SITE_URL` to the live site address first, or the codes will point at localhost.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. At vercel.com, import the repository.
3. Add the four variables from `.env.local` under **Settings > Environment Variables**, with `NEXT_PUBLIC_SITE_URL` set to the live address.
4. Deploy.

## Before going live

- [ ] Team photos and roles
- [ ] Process, temple and product photos (own photos, or Unsplash/Pexels with credit)
- [ ] Each temple's permission before ticking "Shown on the site"
- [ ] Product prices
- [ ] Send a test message from both forms and check it arrives

## Design and interaction updates

The visual system draws on Jaipur floral block prints and architectural arches: paper, sandstone, marigold and botanical green, with original vector ornaments. Fonts are bundled locally with their SIL Open Font License files; builds do not contact Google Fonts. The homepage introduces the flower cycle, collection, recorded impact, temple partners, batch lookup and practical FAQs.

- Product filters support `/shop?type=rangoli` and `/shop?type=compost`; older colour-category links still work. Choosing a product selects it in the request form and shows the product subtotal when a price is published.
- The product catalogue in `src/lib/catalogue.ts` includes the team-supplied Kesar Kyari, Sunheri Subah and Temple Bloom imagery and label information. Rangoli pouches have separate front/back views, ingredients, usage instructions and details of the photographed pack. Label MRPs are displayed for catalogue previews; batch dates describe the pack shown. Live database product IDs, prices and stock remain authoritative when connected.
- Without a live catalogue connection, products link to contact enquiries and online order submission remains disabled. Missing form credentials show an unavailable state; setup details stay out of public notices.
- Forms prevent duplicate submissions, preserve entries after failures and stop waiting after 15 seconds. A timeout warns that delivery may be uncertain.
- Loading, route retry, root error and missing-page states match the design. Batch IDs are validated before querying.
- Section entrances, the moving cycle path and botanical movement respect reduced-motion preferences. Mobile navigation closes on Escape and outside clicks.
- Admin screens show loading and retry states, report save/delete/QR failures, verify access against the current user, and accept JPG/PNG/WebP photos up to 5 MB.

Live email delivery, authentication and database changes still require the configured services and should be checked against your own staging project before release. Product trace pages distinguish label details from collection records. No collection dates, per-temple weights or batch source links are invented. All three products link to traceability; Temple Bloom currently has a product journey without a batch ID.

### Colour and craft refinement

The opening now uses forest green and marigold, with ochre collection panels, terracotta traceability, floral block-print repeats and jaali borders. Product illustrations use separate flower and sprout drawings; offset compositions and concrete copy replace repeated cream sections and slogans. Turbopack build persistence is disabled after repeated cache database failures; local fonts remain bundled for network-independent builds.

### Layout conventions

Page introductions and paired sections use equal-width columns and one shared gutter/gap system. Team cards occupy a full-width grid; collection and product artwork have consistent proportions. Contact and order field rows use container queries, so fields stay stacked until the actual form panel is wide enough. Long batch details wrap, and admin tables scroll within their own panel.


### Temple photograph credits

- Jharkhand Mahadev Mandir: photograph from the temple’s official website, https://jharkhandmahadev.in/jkmadmin/uploads/banners/1551519133.jpg. Linked credit appears on the temple card.
- Shri Radha Gopinath Ji Temple: Anildiggiwal, 8 May 2025, CC0, https://commons.wikimedia.org/wiki/File:Shri_Radha_Gopinath_Ji_Temple_Jaipur.jpg. Linked attribution appears on the temple card.
- Shiv Mandir, Rangoli Road: a representative AI-generated Shiva shrine illustration replaces the title panel. The caption and image alt text identify it as an illustration; it is not a documentary photograph of the named temple. Asset: `public/images/temples/shiv-mandir-illustration.webp`. Replace it when a verified site photograph is supplied.

The team inbox `recccreate@gmail.com` is transcribed from the supplied Kesar Kyari packaging. Never add placeholder phone numbers from packaging artwork.


### Buying enquiries and current MRP

Both rangoli colours have MRP ₹20; Temple Bloom flower compost has MRP ₹50. Prices and contact product options come from `src/lib/catalogue.ts`. The Kesar Kyari back photograph has been corrected to ₹20 and uses a new asset filename to avoid stale image caches.

Choosing Buying on Contact reveals a required Product selector. The selected product and current MRP are included in the email draft and the Sheet’s About column, preserving compatibility with the deployed version-2 script and keeping the complete Message column intact. Other topics discard hidden product selections.
