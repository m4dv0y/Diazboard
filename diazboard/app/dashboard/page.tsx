"use client";
import { Col, Row, Typography } from "antd";
import DashboardPanel from "@/app/components/DashboardPanel";
import TrendsChart from "@/app/components/TrendsChart";
import { Card, Col as AntCol, Row as AntRow } from "antd";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [labels, setLabels] = useState<string[]>(["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
  const [incomeSeries, setIncomeSeries] = useState<number[]>([1200, 1400, 1500, 1300, 1700, 1800]);
  const [expenseSeries, setExpenseSeries] = useState<number[]>([800, 900, 1100, 1000, 1200, 1100]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [totalsByPlatform, setTotalsByPlatform] = useState<{ platform: string; amountCents: number }[]>([]);

  useEffect(() => {
    async function load() {
      const [incomes, expenses, investments] = await Promise.all([
        fetch("/api/incomes").then((r) => r.json()),
        fetch("/api/expenses").then((r) => r.json()),
        fetch("/api/investments").then((r) => r.json()),
      ]);

      // Simple totals (raw cents)
      setTotalIncome(incomes.reduce((s: number, i: any) => s + (i.amountCents || 0), 0));
      setTotalExpenses(expenses.reduce((s: number, e: any) => s + (e.amountCents || 0), 0));
      setTotalInvestments(investments.reduce((s: number, v: any) => s + (v.amountCents || 0), 0));

      // Top performers (by performance descending)
      const sorted = [...investments].sort((a: any, b: any) => (b.performance || 0) - (a.performance || 0));
      setTopPerformers(sorted.slice(0, 10));

      // Totals by platform
      const platformMap: Record<string, number> = {};
      for (const v of investments) {
        platformMap[v.platform] = (platformMap[v.platform] || 0) + (v.amountCents || 0);
      }
      const platformRows = Object.entries(platformMap)
        .map(([platform, amountCents]) => ({ platform, amountCents }))
        .sort((a, b) => b.amountCents - a.amountCents);
      setTotalsByPlatform(platformRows);
    }
    load();
  }, []);

  const formatMoney = (cents: number) => `$${(cents / 100).toLocaleString()}`;

  return (
    <div className="p-2 sm:p-4">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3} className="!mb-0">
            Dashboard
          </Typography.Title>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Total Income" value={formatMoney(totalIncome)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Total Expenses" value={formatMoney(totalExpenses)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Net" value={formatMoney(totalIncome - totalExpenses)} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardPanel title="Investments" value={formatMoney(totalInvestments)} />
        </Col>

        <Col span={24}>
          <TrendsChart labels={labels} income={incomeSeries} expenses={expenseSeries} />
        </Col>

        <Col span={24} lg={12}>
          <Card bordered className="shadow-sm">
            <Typography.Title level={4} className="!mb-4">Top 10 Performers</Typography.Title>
            <div className="space-y-2">
              {topPerformers.map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{v.asset}</span>
                  <span className={""}>{(v.performance ?? 0)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={24} lg={12}>
          <Card bordered className="shadow-sm">
            <Typography.Title level={4} className="!mb-4">Totals by Platform</Typography.Title>
            <div className="space-y-2">
              {totalsByPlatform.map((p) => (
                <div key={p.platform} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.platform}</span>
                  <span>${(p.amountCents / 100).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
