"use client";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
