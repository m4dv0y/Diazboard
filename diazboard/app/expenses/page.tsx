"use client";
import { Button, Card, Modal, Table, Form, Input, DatePicker, Select, InputNumber, Typography, Space, Tag, Input as AntInput } from "antd";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type Expense = {
  id: string;
  date: string;
  category: string;
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
  const [filteredData, setFilteredData] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/expenses");
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
      item.category.toLowerCase().includes(searchText.toLowerCase()) ||
      item.currency.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.amountCents / 100).toString().includes(searchText)
    );
    setFilteredData(filtered);
  }, [data, searchText]);

  const handleEdit = (record: Expense) => {
    setEditingExpense(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : undefined,
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

    if (editingExpense) {
      await fetch("/api/expenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingExpense.id }),
      });
    } else {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setOpen(false);
    setEditingExpense(null);
    form.resetFields();
    load();
  };

  const handleCancel = () => {
    setOpen(false);
    setEditingExpense(null);
    form.resetFields();
  };

  const columns = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        sorter: (a: Expense, b: Expense) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        render: (d: string) => {
          const dt = new Date(d);
          return isNaN(dt.getTime()) ? d : format(dt, "dd/MM/yyyy");
        },
      },
      { 
        title: "Category", 
        dataIndex: "category",
        key: "category",
        sorter: (a: Expense, b: Expense) => a.category.localeCompare(b.category),
        filters: [...new Set(data.map(item => item.category))].map(cat => ({ text: cat, value: cat })),
        onFilter: (value: string, record: Expense) => record.category === value,
      },
      {
        title: "Amount",
        dataIndex: "amountCents",
        key: "amountCents",
        sorter: (a: Expense, b: Expense) => a.amountCents - b.amountCents,
        render: (cents: number, row: Expense) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      { 
        title: "Currency", 
        dataIndex: "currency", 
        key: "currency",
        render: (c: string) => <Tag>{c}</Tag>,
        filters: currencyOptions.map(opt => ({ text: opt.label, value: opt.value })),
        onFilter: (value: string, record: Expense) => record.currency === value,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, row: Expense) => (
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
                await fetch(`/api/expenses?id=${row.id}`, { method: "DELETE" });
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
        <Typography.Title level={3} className="!mb-0">💸 Expenses</Typography.Title>
        
        <Card variant="outlined" className="shadow-sm">
          <div className="mb-4">
            <AntInput
              placeholder="Search by category, currency, or amount..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </div>
          
          <div className="mb-4">
            <Button type="primary" onClick={() => setOpen(true)}>
              ➕ Add Expense
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
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        open={open}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
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
