"use client";
import { Layout } from "antd";

export default function Footer() {
  const year = new Date().getFullYear();
  
  const techStack = [
    { name: "Next.js", icon: "⚛️", color: "bg-black text-white" },
    { name: "TypeScript", icon: "🔷", color: "bg-blue-600 text-white" },
    { name: "Tailwind CSS", icon: "💨", color: "bg-cyan-500 text-white" },
    { name: "Ant Design", icon: "🎨", color: "bg-blue-500 text-white" },
    { name: "Prisma", icon: "🗄️", color: "bg-gray-800 text-white" },
    { name: "PostgreSQL", icon: "🐘", color: "bg-blue-700 text-white" },
    { name: "Chart.js", icon: "📊", color: "bg-red-500 text-white" },
    { name: "Vercel", icon: "▲", color: "bg-black text-white" },
  ];

  return (
    <Layout.Footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto w-full px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800 mb-2">💰 DiazBoard</h3>
            <p className="text-gray-600 text-sm">
              Your personal finance dashboard for tracking expenses, incomes, and investments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <div><a href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">📊 Dashboard</a></div>
              <div><a href="/expenses" className="text-gray-600 hover:text-blue-600 transition-colors">💸 Expenses</a></div>
              <div><a href="/incomes" className="text-gray-600 hover:text-blue-600 transition-colors">💰 Incomes</a></div>
              <div><a href="/investments" className="text-gray-600 hover:text-blue-600 transition-colors">📈 Investments</a></div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-md font-semibold text-gray-800 mb-3">About</h4>
            <div className="space-y-2 text-sm">
              <div><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">ℹ️ About DiazBoard</a></div>
              <div className="text-gray-600">🚀 Built with modern tech</div>
              <div className="text-gray-600">⚡ Fast & responsive</div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">🛠️ Built with</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${tech.color} shadow-sm hover:shadow-md transition-shadow`}
              >
                <span className="text-sm">{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 mt-6 text-center">
          <p className="text-sm text-gray-500">
            © {year} DiazBoard. All rights reserved. Made with ❤️ for better financial management.
          </p>
        </div>
      </div>
    </Layout.Footer>
  );
}

