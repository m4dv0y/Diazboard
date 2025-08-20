"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Select, Segmented, Layout, Menu, Space, Typography } from "antd";
import { useMemo } from "react";

const { Header: AntHeader } = Layout;

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "CLP", value: "CLP" },
  { label: "QAR", value: "QAR" },
  { label: "PHP", value: "PHP" },
];

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [_, maybeLocale, ...rest] = pathname.split("/");
  const locale = ["en", "es"].includes(maybeLocale) ? maybeLocale : "en";

  const basePath = useMemo(() => `/${locale}`, [locale]);
  const currentPath = `/${rest.join("/")}`;

  return (
    <AntHeader className="bg-white px-4 flex items-center justify-between shadow-sm">
      <Space size={16} className="items-center">
        <Typography.Title level={4} className="!mb-0">
          <Link href={`${basePath}/dashboard`}>{t("app.title")}</Link>
        </Typography.Title>
        <Menu
          mode="horizontal"
          selectedKeys={[currentPath.startsWith("/dashboard") ? "dashboard" : currentPath.split("/")[1] || "dashboard"]}
          items={[
            { key: "dashboard", label: <Link href={`${basePath}/dashboard`}>{t("nav.dashboard")}</Link> },
            { key: "expenses", label: <Link href={`${basePath}/expenses`}>{t("nav.expenses")}</Link> },
            { key: "incomes", label: <Link href={`${basePath}/incomes`}>{t("nav.incomes")}</Link> },
            { key: "investments", label: <Link href={`${basePath}/investments`}>{t("nav.investments")}</Link> },
          ]}
        />
      </Space>
      <Space size={12}>
        <Segmented
          value={locale}
          options={[
            { label: "EN", value: "en" },
            { label: "ES", value: "es" },
          ]}
          onChange={(val) => {
            const newPath = `/${val}${currentPath}`;
            window.location.assign(newPath);
          }}
        />
        <Select
          defaultValue="USD"
          options={currencyOptions}
          style={{ width: 100 }}
        />
      </Space>
    </AntHeader>
  );
}
