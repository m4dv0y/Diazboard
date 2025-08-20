"use client";
import { Layout } from "antd";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Layout.Footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">© {year} DiazBoard</div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <img alt="Next.js" src="/logos/nextjs.svg" className="h-5" />
          <img alt="TypeScript" src="/logos/typescript.svg" className="h-5" />
          <img alt="Tailwind CSS" src="/logos/tailwindcss.svg" className="h-5" />
          <img alt="Ant Design" src="/logos/antdesign.svg" className="h-5" />
          <img alt="Prisma" src="/logos/prisma.svg" className="h-5" />
          <img alt="Neon" src="/logos/neon.svg" className="h-5" />
          <img alt="Chart.js" src="/logos/chartjs.svg" className="h-5" />
          <img alt="Vercel" src="/logos/vercel.svg" className="h-5" />
        </div>
      </div>
    </Layout.Footer>
  );
}

