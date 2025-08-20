"use client";
import { Button, Card, Modal, Table, Form, Input, DatePicker, Select, InputNumber } from "antd";
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
      { title: "Date", dataIndex: "date" },
      { title: "Source", dataIndex: "source" },
      { title: "Description", dataIndex: "description" },
      {
        title: "Amount",
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
          }}>Delete</Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <Card title="Incomes" extra={<Button type="primary" onClick={() => setOpen(true)}>Add</Button>}>
        <Table rowKey="id" dataSource={data} columns={columns as any} loading={loading} />
      </Card>
      <Modal
        title="Add Income"
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
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="source" label="Source" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="currency" label="Currency" rules={[{ required: true }]} initialValue={"USD"}>
            <Select options={currencyOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
