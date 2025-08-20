"use client";
import { Button, Card, Modal, Table, Form, Input, DatePicker, Select, InputNumber } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type Income = {
  id: string;
  date: string;
  source: string;
  description?: string | null;
  amountCents: number;
  currency: string;
};

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "CLP", value: "CLP" },
  { label: "QAR", value: "QAR" },
  { label: "PHP", value: "PHP" },
];

export default function IncomesPage() {
  const t = useTranslations();
  const [data, setData] = useState<Income[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/incomes");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo(
    () => [
      { title: t("income.date"), dataIndex: "date" },
      { title: t("income.source"), dataIndex: "source" },
      { title: t("income.description"), dataIndex: "description" },
      {
        title: t("income.amount"),
        dataIndex: "amountCents",
        render: (cents: number, row: Income) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      {
        title: "",
        dataIndex: "actions",
        render: (_: any, row: Income) => (
          <Button danger onClick={async () => {
            await fetch(`/api/incomes?id=${row.id}`, { method: "DELETE" });
            load();
          }}>{t("actions.delete")}</Button>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="p-6">
      <Card title={t("nav.incomes")} extra={<Button type="primary" onClick={() => setOpen(true)}>{t("actions.add")}</Button>}>
        <Table rowKey="id" dataSource={data} columns={columns as any} loading={loading} />
      </Card>
      <Modal
        title={t("actions.add")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          await fetch("/api/incomes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...values,
              date: values.date.format("YYYY-MM-DD"),
              amountCents: Math.round(values.amount * 100),
            }),
          });
          setOpen(false);
          form.resetFields();
          load();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label={t("income.date")} rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="source" label={t("income.source")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t("income.description")}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label={t("income.amount")} rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="currency" label={t("header.currency")} rules={[{ required: true }]} initialValue={"USD"}>
            <Select options={currencyOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
