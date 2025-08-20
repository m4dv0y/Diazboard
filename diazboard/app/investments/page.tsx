"use client";
import { Button, Card, Modal, Table, Form, Input, Select, InputNumber, Typography, Space, Tag, Input as AntInput } from "antd";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
  const [filteredData, setFilteredData] = useState<Investment[]>([]);
  const [open, setOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/investments");
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
      item.platform.toLowerCase().includes(searchText.toLowerCase()) ||
      item.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      item.currency.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.amountCents / 100).toString().includes(searchText) ||
      item.allocation.toString().includes(searchText) ||
      item.performance.toString().includes(searchText)
    );
    setFilteredData(filtered);
  }, [data, searchText]);

  const handleEdit = (record: Investment) => {
    setEditingInvestment(record);
    form.setFieldsValue({
      ...record,
      amount: record.amountCents / 100,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      amountCents: Math.round(values.amount * 100),
    };

    if (editingInvestment) {
      await fetch("/api/investments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingInvestment.id }),
      });
    } else {
      await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setOpen(false);
    setEditingInvestment(null);
    form.resetFields();
    load();
  };

  const handleCancel = () => {
    setOpen(false);
    setEditingInvestment(null);
    form.resetFields();
  };

  const columns = useMemo(
    () => [
      { 
        title: "Platform", 
        dataIndex: "platform",
        key: "platform",
        sorter: (a: Investment, b: Investment) => a.platform.localeCompare(b.platform),
        filters: [...new Set(data.map(item => item.platform))].map(platform => ({ text: platform, value: platform })),
        onFilter: (value: string, record: Investment) => record.platform === value,
      },
      { 
        title: "Asset", 
        dataIndex: "asset",
        key: "asset",
        sorter: (a: Investment, b: Investment) => a.asset.localeCompare(b.asset),
        filters: [...new Set(data.map(item => item.asset))].map(asset => ({ text: asset, value: asset })),
        onFilter: (value: string, record: Investment) => record.asset === value,
      },
      {
        title: "Amount",
        dataIndex: "amountCents",
        key: "amountCents",
        sorter: (a: Investment, b: Investment) => a.amountCents - b.amountCents,
        render: (cents: number, row: Investment) => `${(cents / 100).toFixed(2)} ${row.currency}`,
      },
      { 
        title: "Currency", 
        dataIndex: "currency", 
        key: "currency",
        render: (c: string) => <Tag>{c}</Tag>,
        filters: currencyOptions.map(opt => ({ text: opt.label, value: opt.value })),
        onFilter: (value: string, record: Investment) => record.currency === value,
      },
      { 
        title: "Allocation (%)", 
        dataIndex: "allocation", 
        key: "allocation",
        sorter: (a: Investment, b: Investment) => a.allocation - b.allocation,
        render: (v: number) => `${v}%` 
      },
      { 
        title: "Performance (%)", 
        dataIndex: "performance", 
        key: "performance",
        sorter: (a: Investment, b: Investment) => a.performance - b.performance,
        render: (v: number) => (
          <span style={{ color: v >= 0 ? 'green' : 'red' }}>
            {v >= 0 ? '+' : ''}{v}%
          </span>
        )
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, row: Investment) => (
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
                await fetch(`/api/investments?id=${row.id}`, { method: "DELETE" });
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
        <Typography.Title level={3} className="!mb-0">📈 Investments</Typography.Title>
        
        <Card bordered className="shadow-sm">
          <div className="mb-4">
            <AntInput
              placeholder="Search by platform, asset, currency, amount, allocation, or performance..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </div>
          
          <div className="mb-4">
            <Button type="primary" onClick={() => setOpen(true)}>
              ➕ Add Investment
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
        title={editingInvestment ? "Edit Investment" : "Add Investment"}
        open={open}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={520}
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
