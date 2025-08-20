"use client";
import { Button, Card, Modal, Table, Form, Input, DatePicker, Select, InputNumber, Typography, Space, Tag } from "antd";
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
      { title: "Date", dataIndex: "date" },
      { title: "Category", dataIndex: "category" },
      { title: "Description", dataIndex: "description" },
      {
        title: "Amount",
        dataIndex: "amountCents",
        render: (cents: number, row: Expense) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      { title: "Currency", dataIndex: "currency", render: (c: string) => <Tag>{c}</Tag> },
      {
        title: "",
        dataIndex: "actions",
        render: (_: any, row: Expense) => (
          <Space>
            <Button danger onClick={async () => {
              await fetch(`/api/expenses?id=${row.id}`, { method: "DELETE" });
              load();
            }}>Delete</Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-2 sm:p-4">
      <Space direction="vertical" size={16} className="w-full">
        <Typography.Title level={3} className="!mb-0">Expenses</Typography.Title>
        <Card
          bordered
          className="shadow-sm"
          extra={<Button type="primary" onClick={() => setOpen(true)}>Add</Button>}
        >
          <Table
            rowKey="id"
            dataSource={data}
            columns={columns as any}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: true }}
          />
        </Card>
      </Space>
      
      <Modal
        title="Add Expense"
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
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
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
