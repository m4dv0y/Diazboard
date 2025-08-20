# DiazBoard — Personal Finance MVP

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5-1677FF?logo=antdesign&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Vercel-4169E1?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

DiazBoard is a fast, modern finance dashboard to track expenses, incomes, and investments. Built to deploy quickly to Vercel and scale with PostgreSQL using Prisma.

## Objectives
- Ship a functional MVP with clean UX across desktop, tablet, and mobile
- Store money as integer cents; currency as enum (USD, CLP, QAR, PHP)
- Provide basic CRUD via App Router API routes
- Offer mock mode when `DATABASE_URL` is missing for instant Vercel deploys
- Integrate exchange rates (exchangerate.host) with caching

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + Ant Design
- Prisma ORM + PostgreSQL (Vercel Postgres)
- react-chartjs-2 (Dashboard chart)

## Data Model (Prisma)
- Expense: id, date, category, description?, amountCents, currency, createdAt, updatedAt
- Income: id, date, source, description?, amountCents, currency, createdAt, updatedAt
- Investment: id, platform, asset, amountCents, currency, allocation (%), performance (%), createdAt, updatedAt

## Local Development
```bash
npm i
cp .env.example .env # set DATABASE_URL when ready
npx prisma generate
npm run dev
# Visit http://localhost:3000 and navigate to /dashboard, /expenses, /incomes, /investments
```

## Deploy (Vercel)
1) Push to GitHub and import the repo into Vercel
2) Root Directory: `diazboard`
3) Environment Variables:
   - `DATABASE_URL` (leave empty to use mock mode, or set Vercel Postgres URL)
   - `NEXT_PUBLIC_DEFAULT_CURRENCY=USD`
4) Deploy

## Production Database (Vercel Postgres)
1) Create a Vercel Postgres instance and set `DATABASE_URL` in Project Settings
2) Apply schema and seed
```bash
DATABASE_URL="postgres://..." npm run db:migrate
DATABASE_URL="postgres://..." npm run db:seed
```

## API Routes (CRUD)
- `GET/POST/PUT/DELETE /api/expenses`
- `GET/POST/PUT/DELETE /api/incomes`
- `GET/POST/PUT/DELETE /api/investments`
- `GET /api/exchange?base=USD&target=CLP`

## Notes
- Mock mode returns sample data if `DATABASE_URL` is not set
- Charts and UI are responsive and use Ant Design components
