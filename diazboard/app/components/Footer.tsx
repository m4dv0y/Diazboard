"use client";
import { Layout } from "antd";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Layout.Footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">© {year} DiazBoard</div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Next.js" src="/logos/nextjs.svg" className="h-5" /> Next.js
          </a>
          <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="TypeScript" src="/logos/typescript.svg" className="h-5" /> TypeScript
          </a>
          <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Tailwind CSS" src="/logos/tailwindcss.svg" className="h-5" /> Tailwind
          </a>
          <a href="https://ant.design/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Ant Design" src="/logos/antdesign.svg" className="h-5" /> Ant Design
          </a>
          <a href="https://www.prisma.io/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Prisma" src="/logos/prisma.svg" className="h-5" /> Prisma
          </a>
          <a href="https://neon.tech" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Neon" src="/logos/neon.svg" className="h-5" /> Neon
          </a>
          <a href="https://www.chartjs.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Chart.js" src="/logos/chartjs.svg" className="h-5" /> Chart.js
          </a>
          <a href="https://vercel.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-gray-50">
            <img alt="Vercel" src="/logos/vercel.svg" className="h-5" /> Vercel
          </a>
        </div>
      </div>
    </Layout.Footer>
  );
}

