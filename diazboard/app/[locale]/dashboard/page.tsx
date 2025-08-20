"use client";
import { Card, Col, Radio, Row, Segmented, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DashboardPage() {
  const t = useTranslations();

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: t("dashboard.overview"),
        data: [1200, 900, 1400, 1100, 1600, 1500],
        borderColor: "#1677ff",
        backgroundColor: "rgba(22,119,255,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={3}>{t("nav.dashboard")}</Typography.Title>
        </Col>
        <Col span={24}>
          <Card>
            <Line data={data} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
