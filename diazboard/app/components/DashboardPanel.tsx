"use client";
import { Card, Typography } from "antd";

export default function DashboardPanel({
  title,
  value,
  hint,
  className,
}: {
  title: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <Card variant="outlined" className={`shadow-sm ${className || ""}`}>
      <Typography.Text type="secondary">{title}</Typography.Text>
      <div className="mt-2 flex items-end justify-between">
        <Typography.Title level={3} className="!mb-0">
          {value}
        </Typography.Title>
        {hint ? (
          <span className="text-xs text-gray-500">{hint}</span>
        ) : null}
      </div>
    </Card>
  );
}

