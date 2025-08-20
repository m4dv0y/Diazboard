"use client";
import { Card, Typography } from "antd";
import { Line } from "@ant-design/charts";

export default function TrendsChart({ labels, income, expenses }: { labels: string[]; income: number[]; expenses: number[] }) {
  // Transform data for Ant Design Charts
  const chartData = [
    ...labels.map((label, index) => ({
      month: label,
      value: income[index],
      type: 'Income',
    })),
    ...labels.map((label, index) => ({
      month: label,
      value: expenses[index],
      type: 'Expenses',
    })),
  ];

  const config = {
    data: chartData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#22c55e', '#ef4444'],
    point: {
      size: 4,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `$${datum.value.toLocaleString()}`,
        };
      },
    },
    legend: {
      position: 'top',
    },
    grid: {
      line: {
        style: {
          stroke: '#f0f0f0',
          lineWidth: 1,
        },
      },
    },
  };

  return (
    <Card variant="outlined" className="shadow-sm">
      <Typography.Title level={4} className="!mb-4">
        📈 Monthly Trend
      </Typography.Title>
      <div style={{ height: '300px' }}>
        <Line {...config} />
      </div>
    </Card>
  );
}

