"use client";
import { Card, Typography } from "antd";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TrendsChart({ labels, income, expenses }: { labels: string[]; income: number[]; expenses: number[] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: income,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: expenses,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // return (
  //   <Card bordered className="shadow-sm">
  //     <Typography.Title level={4} className="!mb-4">
  //       Monthly Trend
  //     </Typography.Title>
  //     <Line data={data} />
  //   </Card>
  // );
}

