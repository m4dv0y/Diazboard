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
    // Fetch summaries
    Promise.all([
      fetch("/api/incomes").then((r) => r.json()),
      fetch("/api/expenses").then((r) => r.json()),
      fetch("/api/investments").then((r) => r.json()),
    ]).then(([incomes, expenses, investments]) => {
      setTotalIncome(incomes.reduce((sum: number, i: any) => sum + (i.amountCents || 0), 0));
      setTotalExpenses(expenses.reduce((sum: number, e: any) => sum + (e.amountCents || 0), 0));
      setTotalInvestments(investments.reduce((sum: number, v: any) => sum + (v.amountCents || 0), 0));
    });
  }, []);

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
