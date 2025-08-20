export default function AboutPage() {
  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold mb-3">About DiazBoard</h1>
        <p className="text-gray-700 mb-4">
          DiazBoard is a personal finance MVP to track your expenses, incomes, and investments. It ships fast,
          deploys on Vercel, and uses Neon (Postgres) via Prisma for reliable data.
        </p>
        <div className="rounded border p-4 bg-white shadow-sm">
          <h2 className="text-lg font-medium mb-2">Project goals</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Simple, responsive UI with Ant Design + Tailwind CSS</li>
            <li>Full CRUD via Next.js App Router APIs</li>
            <li>Money stored as integer cents; currency as enum</li>
            <li>Exchange rates via a free API with caching</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

