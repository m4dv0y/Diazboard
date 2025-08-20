"use client";
import { Col, Row, Typography } from "antd";
import DashboardPanel from "@/app/components/DashboardPanel";
import TrendsChart from "@/app/components/TrendsChart";
import InvestmentDistributionChart from "@/app/components/InvestmentDistributionChart";
import { Card, Col as AntCol, Row as AntRow } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/app/components/CurrencyProvider";
import { convertCents } from "@/app/lib/exchange";

export default function DashboardPage() {
  const { currency, getRate } = useCurrency();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [labels, setLabels] = useState<string[]>(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
  const [incomeSeries, setIncomeSeries] = useState<number[]>([1200, 1400, 1500, 1300, 1700, 1800]);
  const [expenseSeries, setExpenseSeries] = useState<number[]>([800, 900, 1100, 1000, 1200, 1100]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [totalsByPlatform, setTotalsByPlatform] = useState<{ platform: string; amountCents: number; currency: string }[]>([]);
  const [convertedTotals, setConvertedTotals] = useState({
    income: 0,
    expenses: 0,
    investments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [incomes, expenses, investments] = await Promise.all([
          fetch("/api/incomes").then((r) => r.json()),
          fetch("/api/expenses").then((r) => r.json()),
          fetch("/api/investments").then((r) => r.json()),
        ]);

        // Convert all amounts to the selected currency with error handling
        let convertedIncome = 0;
        let convertedExpenses = 0;
        let convertedInvestments = 0;

        // Convert income totals
        for (const income of incomes) {
          try {
            const converted = await convertCents(income.amountCents, income.currency, currency);
            convertedIncome += converted;
          } catch (error) {
            console.warn(`Failed to convert income ${income.id}:`, error);
            // Fallback: use original amount if conversion fails
            convertedIncome += income.amountCents;
          }
        }

        // Convert expense totals
        for (const expense of expenses) {
          try {
            const converted = await convertCents(expense.amountCents, expense.currency, currency);
            convertedExpenses += converted;
          } catch (error) {
            console.warn(`Failed to convert expense ${expense.id}:`, error);
            // Fallback: use original amount if conversion fails
            convertedExpenses += expense.amountCents;
          }
        }

        // Convert investment totals
        for (const investment of investments) {
          try {
            const converted = await convertCents(investment.amountCents, investment.currency, currency);
            convertedInvestments += converted;
          } catch (error) {
            console.warn(`Failed to convert investment ${investment.id}:`, error);
            // Fallback: use original amount if conversion fails
            convertedInvestments += investment.amountCents;
          }
        }

        setConvertedTotals({
          income: convertedIncome,
          expenses: convertedExpenses,
          investments: convertedInvestments,
        });

        // Keep original totals for reference
        setTotalIncome(incomes.reduce((s: number, i: any) => s + (i.amountCents || 0), 0));
        setTotalExpenses(expenses.reduce((s: number, e: any) => s + (e.amountCents || 0), 0));
        setTotalInvestments(investments.reduce((s: number, v: any) => s + (v.amountCents || 0), 0));

        // Top performers (by performance descending)
        const sorted = [...investments].sort((a: any, b: any) => (b.performance || 0) - (a.performance || 0));
        setTopPerformers(sorted.slice(0, 10));

        // Totals by platform with currency info
        const platformMap: Record<string, { amountCents: number; currency: string }> = {};
        for (const v of investments) {
          if (!platformMap[v.platform]) {
            platformMap[v.platform] = { amountCents: 0, currency: v.currency };
          }
          platformMap[v.platform].amountCents += (v.amountCents || 0);
        }
        const platformRows = Object.entries(platformMap)
          .map(([platform, data]) => ({ platform, ...data }))
          .sort((a, b) => b.amountCents - a.amountCents);
        setTotalsByPlatform(platformRows);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currency]);

  const formatMoney = (cents: number) => {
    const symbol = currency === 'USD' ? '$' : currency === 'CLP' ? 'CLP$' : currency === 'QAR' ? 'QR' : '₱';
    return `${symbol}${(cents / 100).toLocaleString()}`;
  };

  return (
    <div className="p-2 sm:p-4">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3} className="!mb-0">
            📊 Dashboard
          </Typography.Title>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Total Income" value={formatMoney(convertedTotals.income)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Total Expenses" value={formatMoney(convertedTotals.expenses)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Net" value={formatMoney(convertedTotals.income - convertedTotals.expenses)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Investments" value={formatMoney(convertedTotals.investments)} />
        </Col>

        {/* Charts in the same row */}
        <Col span={24} lg={12}>
          <TrendsChart labels={labels} income={incomeSeries} expenses={expenseSeries} />
        </Col>
        <Col span={24} lg={12}>
          <InvestmentDistributionChart data={totalsByPlatform} />
        </Col>

        <Col span={24} lg={12}>
          <Card variant="outlined" className="shadow-sm">
            <Typography.Title level={4} className="!mb-4">🏆 Top 10 Performers</Typography.Title>
            <div className="space-y-2">
              {topPerformers.map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{v.asset}</span>
                  <span className={v.performance >= 0 ? "text-green-600" : "text-red-600"}>
                    {v.performance >= 0 ? '+' : ''}{(v.performance ?? 0)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card variant="outlined" className="shadow-sm">
            <Typography.Title level={4} className="!mb-4">💼 Totals by Platform</Typography.Title>
            <div className="space-y-2">
              {totalsByPlatform.map((p) => (
                <div key={p.platform} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.platform}</span>
                  <span>{formatMoney(p.amountCents)}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
