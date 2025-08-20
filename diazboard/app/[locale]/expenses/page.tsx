"use client";
import { Button, Card, Modal, Table, Form, Input, DatePicker, Select, InputNumber } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type Expense = {
  id: string;
  date: string;
  category: string;
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

export default function ExpensesPage() {
  const t = useTranslations();
  const [data, setData] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/expenses");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo(
    () => [
      { title: t("expense.date"), dataIndex: "date" },
      { title: t("expense.category"), dataIndex: "category" },
      { title: t("expense.description"), dataIndex: "description" },
      {
        title: t("expense.amount"),
        dataIndex: "amountCents",
        render: (cents: number, row: Expense) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      {
        title: "",
        dataIndex: "actions",
        render: (_: any, row: Expense) => (
          <Button danger onClick={async () => {
            await fetch(`/api/expenses?id=${row.id}`, { method: "DELETE" });
            load();
          }}>{t("actions.delete")}</Button>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="p-6">
      <Card title={t("nav.expenses")} extra={<Button type="primary" onClick={() => setOpen(true)}>{t("actions.add")}</Button>}>
        <Table rowKey="id" dataSource={data} columns={columns as any} loading={loading} />
      </Card>
      <Modal
        title={t("actions.add")}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          await fetch("/api/expenses", {
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
          <Form.Item name="date" label={t("expense.date")} rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="category" label={t("expense.category")} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t("expense.description")}> 
            <Input />
          </Form.Item>
          <Form.Item name="amount" label={t("expense.amount")} rules={[{ required: true }]}>
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
