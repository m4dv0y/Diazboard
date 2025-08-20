"use client";
import { Layout } from "antd";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Layout.Footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">© {year} DiazBoard</div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span className="px-2 py-1 rounded border">Next.js</span>
          <span className="px-2 py-1 rounded border">TypeScript</span>
          <span className="px-2 py-1 rounded border">Tailwind CSS</span>
          <span className="px-2 py-1 rounded border">Ant Design</span>
          <span className="px-2 py-1 rounded border">Prisma</span>
          <span className="px-2 py-1 rounded border">Neon (Postgres)</span>
          <span className="px-2 py-1 rounded border">Chart.js</span>
          <span className="px-2 py-1 rounded border">Vercel</span>
        </div>
      </div>
    </Layout.Footer>
  );
}

