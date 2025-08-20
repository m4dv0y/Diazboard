"use client";
import { Layout } from "antd";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Layout.Footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">© {year} DiazBoard</div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Image src="/next.svg" alt="Next.js" width={20} height={20} />
            <span>Next.js</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/typescript.svg" alt="TypeScript" width={20} height={20} />
            <span>TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/tailwindcss.svg" alt="Tailwind CSS" width={20} height={20} />
            <span>Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/antd.svg" alt="Ant Design" width={20} height={20} />
            <span>Ant Design</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/prisma.svg" alt="Prisma" width={20} height={20} />
            <span>Prisma</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/postgresql.svg" alt="Neon (Postgres)" width={20} height={20} />
            <span>Neon (Postgres)</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/chartjs.svg" alt="Chart.js" width={20} height={20} />
            <span>Chart.js</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/vercel.svg" alt="Vercel" width={20} height={20} />
            <span>Vercel</span>
          </div>
        </div>
      </div>
    </Layout.Footer>
  );
}

