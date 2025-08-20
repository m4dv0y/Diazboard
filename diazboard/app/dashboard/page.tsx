"use client";
import { Col, Row, Typography } from "antd";
import DashboardPanel from "@/app/components/DashboardPanel";
import TrendsChart from "@/app/components/TrendsChart";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/app/components/CurrencyProvider";

export default function DashboardPage() {
  const { currency, getRate } = useCurrency();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [labels, setLabels] = useState<string[]>(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
  const [incomeSeries, setIncomeSeries] = useState<number[]>([1200, 1400, 1500, 1300, 1700, 1800]);
  const [expenseSeries, setExpenseSeries] = useState<number[]>([800, 900, 1100, 1000, 1200, 1100]);

  useEffect(() => {
    async function load() {
      const [incomes, expenses, investments] = await Promise.all([
        fetch("/api/incomes").then((r) => r.json()),
        fetch("/api/expenses").then((r) => r.json()),
        fetch("/api/investments").then((r) => r.json()),
      ]);

      const convertRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: currency,
          items: [
            ...incomes.map((i: any) => ({ amountCents: i.amountCents, currency: i.currency })),
            ...expenses.map((e: any) => ({ amountCents: e.amountCents, currency: e.currency })),
            ...investments.map((v: any) => ({ amountCents: v.amountCents, currency: v.currency })),
          ],
        }),
      }).then((r) => r.json());

      // For panel totals, compute separately using the same target
      const incomeRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: currency, items: incomes.map((i: any) => ({ amountCents: i.amountCents, currency: i.currency })) }),
      }).then((r) => r.json());
      const expenseRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: currency, items: expenses.map((e: any) => ({ amountCents: e.amountCents, currency: e.currency })) }),
      }).then((r) => r.json());
      const investRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: currency, items: investments.map((v: any) => ({ amountCents: v.amountCents, currency: v.currency })) }),
      }).then((r) => r.json());

      setTotalIncome(incomeRes.totalCents || 0);
      setTotalExpenses(expenseRes.totalCents || 0);
      setTotalInvestments(investRes.totalCents || 0);
    }
    load();
  }, [currency]);

  const [baseTotals, setBaseTotals] = useState<{ income: number; expenses: number; investments: number } | null>(null);

  useEffect(() => {
    setBaseTotals({ income: totalIncome, expenses: totalExpenses, investments: totalInvestments });
  }, [totalIncome, totalExpenses, totalInvestments]);

  const [converted, setConverted] = useState<{ income: number; expenses: number; investments: number }>({ income: 0, expenses: 0, investments: 0 });

  useEffect(() => {
    let cancelled = false;
    async function convert() {
      if (!baseTotals) return;
      // naive approach: assume income/expense/investment currencies vary; for MVP, treat as USD and convert totals to selected currency
      const rate = await getRate("USD" as any, currency as any);
      if (cancelled) return;
      setConverted({
        income: Math.round(baseTotals.income * rate),
        expenses: Math.round(baseTotals.expenses * rate),
        investments: Math.round(baseTotals.investments * rate),
      });
    }
    convert();
    return () => {
      cancelled = true;
    };
  }, [baseTotals, currency, getRate]);

  const formatMoney = (cents: number) => `${(cents / 100).toLocaleString()} ${currency}`;

  return (
    <div className="p-2 sm:p-4">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3} className="!mb-0">
            Dashboard
          </Typography.Title>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Total Income" value={formatMoney(converted.income)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Total Expenses" value={formatMoney(converted.expenses)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Net" value={formatMoney(converted.income - converted.expenses)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Investments" value={formatMoney(converted.investments)} />
        </Col>

        <Col span={24}>
          <TrendsChart labels={labels} income={incomeSeries} expenses={expenseSeries} />
        </Col>
      </Row>
    </div>
  );
}
