# ReCCCreate

*CCC stands for Credit. Community. Change.*

Website for a student venture that collects flowers offered at Jaipur temples and turns them into natural gulaal and compost. Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase and Web3Forms.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without any keys the site still runs: it shows clearly labelled sample data, and submission is disabled with an unavailable notice.

## Connect the services

Copy `.env.example` to `.env.local` and fill it in. Never commit `.env.local`.

### 1. Web3Forms (contact and order forms)

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

## Where to change things

| What | Where |
|---|---|
| Temples, collections, batches, products | `/admin` |
| Homepage artwork and illustration labels | Hero `Image` and caption in `src/app/page.tsx` |
| Team names and process descriptions | `team` and `steps` in `src/app/about/page.tsx` |
| Floral illustrations | `src/components/BotanicalMotif.tsx` |
| Colours and type sizes | `src/app/globals.css` |
| Bundled fonts (Montserrat and DM Serif Display) | `public/fonts` and `src/app/layout.tsx` |
| Database tables and security rules | `supabase/schema.sql` |

## How the figures are worked out

- **Flowers collected so far:** the sum of every row in `collections`.
- **Gulaal made so far:** the sum of `kg_produced` over gulaal batches.
- **Projected kg a year:** average kg per day × 365. The average covers every day from the first collection to the last, so days with no pickup count as zero.

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

- Product filters support `/shop?type=gulaal` and `/shop?type=compost`. Choosing a product selects it in the request form and shows the product subtotal when a price is published.
- Sample products cannot be ordered. Missing form credentials show an unavailable state; setup details stay out of public notices.
- Forms prevent duplicate submissions, preserve entries after failures and stop waiting after 15 seconds. A timeout warns that delivery may be uncertain.
- Loading, route retry, root error and missing-page states match the design. Batch IDs are validated before querying.
- Section entrances, the moving cycle path and botanical movement respect reduced-motion preferences. Mobile navigation closes on Escape and outside clicks.
- Admin screens show loading and retry states, report save/delete/QR failures, verify access against the current user, and accept JPG/PNG/WebP photos up to 5 MB.

Live email delivery, authentication and database changes still require the configured services and should be checked against your own staging project before release. Illustrations and sample data are labelled; replace them with approved project records and photographs when available.
