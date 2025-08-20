"use client";
import { Col, Row, Typography } from "antd";
import DashboardPanel from "@/app/components/DashboardPanel";
import TrendsChart from "@/app/components/TrendsChart";
import { useEffect, useState } from "react";

export default function DashboardPage() {
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
      </Row>
    </div>
  );
}
