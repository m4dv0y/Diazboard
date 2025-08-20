"use client";
import { Button, Card, Modal, Table, Form, Input, Select, InputNumber } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type Investment = {
  id: string;
  platform: string;
  asset: string;
  amountCents: number;
  currency: string;
  allocation: number;
  performance: number;
};

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "CLP", value: "CLP" },
  { label: "QAR", value: "QAR" },
  { label: "PHP", value: "PHP" },
];

export default function InvestmentsPage() {
  const t = useTranslations();
  const [data, setData] = useState<Investment[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/investments");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo(
    () => [
      { title: t("investment.platform"), dataIndex: "platform" },
      { title: t("investment.asset"), dataIndex: "asset" },
      {
        title: t("investment.amount"),
        dataIndex: "amountCents",
        render: (cents: number, row: Investment) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      { title: t("investment.allocation"), dataIndex: "allocation", render: (v: number) => `${v}%` },
      { title: t("investment.performance"), dataIndex: "performance", render: (v: number) => `${v}%` },
      {
        title: "",
        dataIndex: "actions",
        render: (_: any, row: Investment) => (
          <Button danger onClick={async () => {
            await fetch(`/api/investments?id=${row.id}`, { method: "DELETE" });
            load();
          }}>{t("actions.delete")}</Button>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="p-6">
      <Card title={t("nav.investments")} extra={<Button type="primary" onClick={() => setOpen(true)}>{t("actions.add")}</Button>}>
        <Table rowKey="id" dataSource={data} columns={columns as any} loading={loading} />
      </Card>
      <Modal
        title={t("actions.add")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          await fetch("/api/investments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...values,
              amountCents: Math.round(values.amount * 100),
            }),
          });
          setOpen(false);
          form.resetFields();
          load();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="platform" label={t("investment.platform")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="asset" label={t("investment.asset")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label={t("investment.amount")} rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="currency" label={t("header.currency")} rules={[{ required: true }]} initialValue={"USD"}>
            <Select options={currencyOptions} />
          </Form.Item>
          <Form.Item name="allocation" label={t("investment.allocation")} rules={[{ required: true }]} initialValue={0}>
            <InputNumber className="w-full" min={0} max={100} />
          </Form.Item>
          <Form.Item name="performance" label={t("investment.performance")} rules={[{ required: true }]} initialValue={0}>
            <InputNumber className="w-full" min={-100} max={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
