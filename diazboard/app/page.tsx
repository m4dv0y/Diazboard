import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">DiazBoard</h1>
      <p className="mb-4">Welcome! This is a minimal MVP using mock data. Navigate below:</p>
      <ul className="list-disc ml-6 space-y-2">
        <li><Link className="text-blue-600 underline" href="/dashboard">Dashboard</Link></li>
        <li><Link className="text-blue-600 underline" href="/expenses">Expenses</Link></li>
        <li><Link className="text-blue-600 underline" href="/incomes">Incomes</Link></li>
        <li><Link className="text-blue-600 underline" href="/investments">Investments</Link></li>
      </ul>
    </div>
  );
}