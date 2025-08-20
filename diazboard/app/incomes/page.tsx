"use client";
import { Button, Card, Modal, Table, Form, Input, DatePicker, Select, InputNumber, Typography, Space, Tag, Input as AntInput } from "antd";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Income = {
  id: string;
  date: string;
  source: string;
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
  const [filteredData, setFilteredData] = useState<Income[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/incomes");
    const json = await res.json();
    setData(json);
    setFilteredData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Filter data based on search text
  useEffect(() => {
    const filtered = data.filter(item =>
      item.source.toLowerCase().includes(searchText.toLowerCase()) ||
      item.currency.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.amountCents / 100).toString().includes(searchText)
    );
    setFilteredData(filtered);
  }, [data, searchText]);

  const handleEdit = (record: Income) => {
    setEditingIncome(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? new Date(record.date) : undefined,
      amount: record.amountCents / 100,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      amountCents: Math.round(values.amount * 100),
    };

    if (editingIncome) {
      await fetch("/api/incomes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingIncome.id }),
      });
    } else {
      await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setOpen(false);
    setEditingIncome(null);
    form.resetFields();
    load();
  };

  const handleCancel = () => {
    setOpen(false);
    setEditingIncome(null);
    form.resetFields();
  };

  const columns = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        sorter: (a: Income, b: Income) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        render: (d: string) => {
          const dt = new Date(d);
          return isNaN(dt.getTime()) ? d : format(dt, "dd/MM/yyyy");
        },
      },
      { 
        title: "Source", 
        dataIndex: "source",
        key: "source",
        sorter: (a: Income, b: Income) => a.source.localeCompare(b.source),
        filters: [...new Set(data.map(item => item.source))].map(src => ({ text: src, value: src })),
        onFilter: (value: string, record: Income) => record.source === value,
      },
      {
        title: "Amount",
        dataIndex: "amountCents",
        key: "amountCents",
        sorter: (a: Income, b: Income) => a.amountCents - b.amountCents,
        render: (cents: number, row: Income) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      { 
        title: "Currency", 
        dataIndex: "currency", 
        key: "currency",
        render: (c: string) => <Tag>{c}</Tag>,
        filters: currencyOptions.map(opt => ({ text: opt.label, value: opt.value })),
        onFilter: (value: string, record: Income) => record.currency === value,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, row: Income) => (
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(row)}
            >
              Edit
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={async () => {
                await fetch(`/api/incomes?id=${row.id}`, { method: "DELETE" });
                load();
              }}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [data]
  );

  return (
    <div className="p-2 sm:p-4">
      <Space direction="vertical" size={16} className="w-full">
        <Typography.Title level={3} className="!mb-0">💰 Incomes</Typography.Title>
        
        <Card variant="outlined" className="shadow-sm">
          <div className="mb-4">
            <AntInput
              placeholder="Search by source, currency, or amount..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </div>
          
          <div className="mb-4">
            <Button type="primary" onClick={() => setOpen(true)}>
              ➕ Add Income
            </Button>
          </div>

          <Table
            rowKey="id"
            dataSource={filteredData}
            columns={columns as any}
            loading={loading}
            bordered
            size="middle"
            scroll={{ x: true }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </Card>
      </Space>
      
      <Modal
        title={editingIncome ? "Edit Income" : "Add Income"}
        open={open}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="source" label="Source" rules={[{ required: true }]}>
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
