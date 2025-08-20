export default function AboutPage() {
  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold mb-3">🚀 About DiazBoard 💰</h1>
        <p className="text-gray-700 mb-4">
          🎯 DiazBoard is a personal finance MVP to track your expenses 💸, incomes 💵, and investments 📈. 
          It ships fast ⚡, deploys on Vercel 🚀, and uses Neon (Postgres) 🐘 via Prisma 🔧 for reliable data.
        </p>
        <div className="rounded border p-4 bg-white shadow-sm">
          <h2 className="text-lg font-medium mb-2">🎯 Project goals</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>🎨 Simple, responsive UI with Ant Design + Tailwind CSS</li>
            <li>⚙️ Full CRUD via Next.js App Router APIs</li>
            <li>💎 Money stored as integer cents; currency as enum</li>
            <li>🌐 Exchange rates via a free API with caching</li>
            <li>📊 Real-time charts and analytics</li>
            <li>🔒 Secure data storage with PostgreSQL</li>
            <li>📱 Mobile-friendly responsive design</li>
            <li>⚡ Fast performance with Next.js 15</li>
          </ul>
        </div>
        
        <div className="rounded border p-4 bg-white shadow-sm mt-4">
          <h2 className="text-lg font-medium mb-2">🛠️ Tech Stack</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>⚛️ React 19 with TypeScript</li>
            <li>🚀 Next.js 15 with App Router</li>
            <li>🎨 Ant Design + Tailwind CSS</li>
            <li>🗄️ Prisma ORM with PostgreSQL</li>
            <li>📊 Chart.js for data visualization</li>
            <li>🌍 Neon Database (PostgreSQL)</li>
            <li>☁️ Vercel for deployment</li>
          </ul>
        </div>
        
        <div className="rounded border p-4 bg-white shadow-sm mt-4">
          <h2 className="text-lg font-medium mb-2">💡 Features</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>📝 Track expenses by category</li>
            <li>💰 Monitor income sources</li>
            <li>📈 Manage investment portfolios</li>
            <li>🌍 Multi-currency support</li>
            <li>📊 Visual analytics and trends</li>
            <li>🔍 Filter and search functionality</li>
            <li>📱 Responsive mobile design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

