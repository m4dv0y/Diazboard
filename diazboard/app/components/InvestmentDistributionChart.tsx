"use client";
import { Card, Typography } from "antd";
import { Pie } from "@ant-design/charts";

type InvestmentData = {
  platform: string;
  amountCents: number;
  currency: string;
};

export default function InvestmentDistributionChart({ data }: { data: InvestmentData[] }) {
  // Transform data for Ant Design Charts
  const chartData = data.map(item => ({
    type: item.platform,
    value: item.amountCents / 100,
    currency: item.currency,
  }));

  const config = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      style: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((datum.value / total) * 100).toFixed(1);
        return {
          name: datum.type,
          value: `$${datum.value.toLocaleString()} (${percentage}%)`,
        };
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    color: [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#84CC16', // Lime
      '#EC4899', // Pink
      '#6366F1', // Indigo
    ],
  };

  return (
    <Card variant="outlined" className="shadow-sm">
      <Typography.Title level={4} className="!mb-4">
        📊 Investment Distribution
      </Typography.Title>
      <div style={{ height: '300px' }}>
        <Pie {...config} />
      </div>
    </Card>
  );
}
