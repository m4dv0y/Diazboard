"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Select, Layout, Menu, Space, Typography } from "antd";
import { useMemo } from "react";

const { Header: AntHeader } = Layout;

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "CLP", value: "CLP" },
  { label: "QAR", value: "QAR" },
  { label: "PHP", value: "PHP" },
];

export default function Header() {
  const pathname = usePathname();
  const currentPath = pathname || "/";

  return (
    <AntHeader className="bg-white px-4 flex items-center justify-between shadow-sm">
      <Space size={16} className="items-center">
        <Typography.Title level={4} className="!mb-0">
          <Link href={`/dashboard`}>DiazBoard</Link>
        </Typography.Title>
        <Menu
          mode="horizontal"
          selectedKeys={[currentPath.split("/")[1] || "dashboard"]}
          items={[
            { key: "dashboard", label: <Link href={`/dashboard`}>Dashboard</Link> },
            { key: "expenses", label: <Link href={`/expenses`}>Expenses</Link> },
            { key: "incomes", label: <Link href={`/incomes`}>Incomes</Link> },
            { key: "investments", label: <Link href={`/investments`}>Investments</Link> },
          ]}
        />
      </Space>
      <Space size={12}>
        <Select
          defaultValue="USD"
          options={currencyOptions}
          style={{ width: 100 }}
        />
      </Space>
    </AntHeader>
  );
}
