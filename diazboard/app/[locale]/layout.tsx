import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/i18n/routing";
import { Layout } from "antd";
import Header from "@/app/components/Header";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </NextIntlClientProvider>
  );
}
