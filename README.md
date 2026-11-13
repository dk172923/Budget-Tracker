# Budget Tracker

A personal budget and expense tracker built with Next.js 14, Clerk, Drizzle ORM and Neon Postgres. We used it as the application under test for the **Software Testing Hackathon by Ingage Technologies**, where our team automated its main user flows with **Selenium and TestNG**.

![Budget Tracker dashboard](public/home-page-img.png)

## Credits

The app is based on the tutorial [**Build & Deploy Full Stack Next.js Expense Tracker app using React, Tailwind Css, Drizzle ORM, Clerk**](https://www.youtube.com/watch?v=pQoHvx0SoiA) by [**TubeGuruji**](https://www.youtube.com/@tubeguruji) (21 April 2024). The original design and code are theirs. Their official source code is available from [tubeguruji.com](https://www.tubeguruji.com). If you like this project, please support the original creator.

Our additions are the Selenium/TestNG test suite and test documentation in [`testing/`](testing/), the `id`/`name` attributes the tests rely on, and the security and deployment changes listed under [Changes from the tutorial](#changes-from-the-tutorial).

## Automated testing demo

The video shows the full TestNG suite signing in, creating a budget, adding, deleting and editing expenses, navigating, deleting the budget and signing out. All 10 test methods pass.

<!--
  To make the video play inline on GitHub:
  1. Edit this README on github.com.
  2. Drag "testing/Budget Tracker Website Testing using TestNG.mp4" into the editor
     (it is already compressed to 9.2 MB, under GitHub's 10 MB limit for free accounts).
  3. GitHub inserts a https://github.com/user-attachments/assets/... link. Keep that line
     and delete the fallback link below.
-->

### 🎬 Test Execution Demo

https://github.com/user-attachments/assets/24686348-4264-436d-a821-a62815bb869f

Test cases, execution instructions, and the complete TestNG project are available in [testing/README.md](testing/README.md).

## Tech stack

| Part | Tool | Free tier used |
|---|---|---|
| Framework | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui | - |
| Auth | [Clerk](https://clerk.com) | Hobby: free up to 50,000 monthly retained users |
| Database | [Neon](https://neon.com) serverless Postgres + [Drizzle ORM](https://orm.drizzle.team) | Free: 1 GB storage, 100 compute-hours a month, no card |
| Hosting | [Vercel](https://vercel.com) | Hobby: free for personal, non-commercial projects |
| Testing | Selenium 4, TestNG 7, ChromeDriver | - |

## Run it locally

You need Node.js 18.18 or newer and free accounts on Clerk and Neon.

```bash
git clone https://github.com/dk172923/Budget-Tracker.git
cd Budget-Tracker
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

Fill in `.env.local` using the two sections below, then:

```bash
npm run db:push   # creates the budgets and expenses tables in Neon
npm run dev       # http://localhost:3000
```

### 1. Get the Clerk keys

1. Sign up at [dashboard.clerk.com](https://dashboard.clerk.com) and click **Create application**.
2. Name it (for example "Budget Tracker"), turn on **Email** sign-in (add Google if you like), and create it.
3. Open **Configure → API keys** and copy:
   - **Publishable key** (`pk_test_...`) into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** (`sk_test_...`) into `CLERK_SECRET_KEY`
4. For the Selenium suite, also add a test user under **Users → Create user** with an email and password.

The `pk_test_`/`sk_test_` keys belong to Clerk's development instance, which is fine for local work and for a demo deployment.

### 2. Get the Neon database URL

1. Sign up at [console.neon.tech](https://console.neon.tech) (no card needed) and create a project. Pick the region closest to you or to your Vercel region.
2. On the project dashboard click **Connect**, keep the default branch and database, and copy the connection string. It looks like `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`.
3. Paste it into `DATABASE_URL` in `.env.local`.

Keep it named `DATABASE_URL`. Anything starting with `NEXT_PUBLIC_` is sent to the browser, and this string contains the database password.

## Deploy for free on Vercel

1. Push the repo to GitHub.
2. Sign in to [vercel.com](https://vercel.com) with GitHub (Hobby plan, no card), click **Add New → Project**, and import the repo. Vercel detects Next.js on its own.
3. Under **Environment Variables**, add the same five values from `.env.local`:
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `DATABASE_URL`.
4. Click **Deploy**. You get a free `*.vercel.app` URL.
5. Run `npm run db:push` once from your machine if you haven't, so the tables exist.

**Custom domain later:** in Vercel open **Project → Settings → Domains**, add the domain, and set the DNS records Vercel shows at your registrar. Domains are free to connect on Hobby. For a real public launch, also create a Clerk **production instance** (it needs your own domain) and swap in its `pk_live_`/`sk_live_` keys.

**Things to know about the free tiers**

- Neon's free database sleeps after 5 idle minutes. The first request after that takes a moment longer. The test suite's first page load wakes it up.
- Vercel Hobby is for personal, non-commercial use. If a free limit is hit, Vercel pauses that feature until the next cycle instead of charging you.
- Keep `@clerk/nextjs` on version 6 and Next.js on 14.2.x as pinned in `package.json`. The newest Clerk major needs Next.js 15.2.3 or newer, so an unpinned upgrade would break the build.

### Other hosts and databases we ruled out

- **Cloudflare Workers/Pages:** the OpenNext adapter supports only Next.js 15 and 16, and the free plan's 3 MiB bundle and 10 ms CPU limits are tight for a Clerk app.
- **Supabase:** a good free Postgres, but free projects pause after 7 days without activity, which suits a rarely-visited demo poorly.
- **Convex:** not SQL. Moving to it means rewriting the whole data layer.

## Changes from the tutorial

- **Database access moved to the server.** The tutorial queried Neon from the browser through `NEXT_PUBLIC_DATABASE_URL`, which exposes the database password to every visitor. All queries now run in server actions (`utils/actions.js`) using a server-only `DATABASE_URL`.
- **Ownership checks.** Each server action looks up the signed-in user from Clerk on the server and only reads or changes that user's budgets and expenses. This also fixes the budget detail page, which previously showed any budget by ID.
- **Clerk upgraded to v6** (`clerkMiddleware`, `afterSignOutUrl` on `ClerkProvider`).
- **Pinned dependencies** and updated Drizzle and the Neon driver; `npm run db:push` now uses the current `drizzle-kit push` command.
- **Removed a third-party ad script** that was loaded on the dashboard.

## Project structure

```
app/
  (auth)/sign-in, sign-up      Clerk hosted sign-in and sign-up
  (routes)/dashboard/          dashboard, budgets, expenses pages
  _components/                 landing page header and hero
components/ui/                 shadcn/ui components
utils/
  schema.jsx                   Drizzle tables: budgets, expenses
  dbConfig.jsx                 Neon connection (server only)
  actions.js                   server actions with auth and ownership checks
middleware.ts                  Clerk route protection
testing/                       Selenium + TestNG suite, test cases, demo video
```

## Hackathon team

**Test Titans**, Tagore Engineering College, for the Software Testing Hackathon by Ingage Technologies.
