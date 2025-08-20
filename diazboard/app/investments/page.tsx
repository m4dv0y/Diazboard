"use client";
import { Button, Card, Modal, Table, Form, Input, Select, InputNumber } from "antd";
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
      { title: "Platform", dataIndex: "platform" },
      { title: "Asset", dataIndex: "asset" },
      {
        title: "Amount",
        dataIndex: "amountCents",
        render: (cents: number, row: Investment) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      { title: "Allocation (%)", dataIndex: "allocation", render: (v: number) => `${v}%` },
      { title: "Performance (%)", dataIndex: "performance", render: (v: number) => `${v}%` },
      {
        title: "",
        dataIndex: "actions",
        render: (_: any, row: Investment) => (
          <Button danger onClick={async () => {
            await fetch(`/api/investments?id=${row.id}`, { method: "DELETE" });
            load();
          }}>Delete</Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <Card title="Investments" extra={<Button type="primary" onClick={() => setOpen(true)}>Add</Button>}>
        <Table rowKey="id" dataSource={data} columns={columns as any} loading={loading} />
      </Card>
      <Modal
        title="Add Investment"
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
          <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="asset" label="Asset" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="currency" label="Currency" rules={[{ required: true }]} initialValue={"USD"}>
            <Select options={currencyOptions} />
          </Form.Item>
          <Form.Item name="allocation" label="Allocation (%)" rules={[{ required: true }]} initialValue={0}>
            <InputNumber className="w-full" min={0} max={100} />
          </Form.Item>
          <Form.Item name="performance" label="Performance (%)" rules={[{ required: true }]} initialValue={0}>
            <InputNumber className="w-full" min={-100} max={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
