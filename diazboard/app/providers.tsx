"use client";
import { Layout } from "antd";
import CurrencyProvider from "@/app/components/CurrencyProvider";
import Header from "@/app/components/Header";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Layout.Content className="bg-gray-50">
          <div className="max-w-6xl mx-auto w-full py-6 px-4">{children}</div>
        </Layout.Content>
      </Layout>
    </CurrencyProvider>
  );
}

