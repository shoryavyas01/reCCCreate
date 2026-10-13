# ReCCCreate

*CCC stands for Credit. Community. Change.*

Website for a student venture that collects flowers offered at Jaipur temples and turns them into natural gulaal and compost. Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase and Web3Forms.

## Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without any keys the site still runs: it shows clearly labelled sample data, and the forms say they are not connected.

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
| Home page hero photos and credits | `heroPhotos` in `src/app/page.tsx` |
| Team names, roles and photos | `team` in `src/app/about/page.tsx` (photos go in `public/team`) |
| Process photos | `steps` in `src/app/about/page.tsx` |
| Colours, type sizes, Garet font | `src/app/globals.css` |
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
- [ ] Garet font files in `public/fonts`, licence confirmed, `@font-face` rules switched on in `globals.css`
- [ ] Send a test message from both forms and check it arrives
