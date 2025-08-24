import React from 'react';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Tag, Progress, Button, Space } from 'antd';
import { request } from '@umijs/max';
import { useRequest } from 'ahooks';

type Pool = {
  name: string;
  size: number;
  alloc: number;
  free: number;
  health: string;
  state?: string;
};

type Resp = { success: boolean; pools: Pool[] };

const fetchMonitor = async () => {
  const res = await request<Resp>('/api/zfs/monitor', { method: 'GET' });
  return res.pools || [];
};

const bytes = (n?: number) => {
  if (!n) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024; i += 1;
  }
  return `${v.toFixed(1)} ${units[i]}`;
};

const healthTag = (h?: string) => {
  const s = (h || '').toUpperCase();
  let color: any = 'default';
  if (s === 'ONLINE' || s === 'HEALTHY') color = 'success';
  else if (s === 'DEGRADED') color = 'warning';
  else if (s === 'FAULTED' || s === 'OFFLINE' || s === 'UNAVAIL') color = 'error';
  return <Tag color={color}>{h || 'UNKNOWN'}</Tag>;
};

const MonitorPage: React.FC = () => {
  const { data, run, loading } = useRequest(fetchMonitor, { pollingInterval: 5000 });

  const columns: any[] = [
    { title: 'Pool', dataIndex: 'name', width: 200 },
    { title: 'Health', dataIndex: 'health', width: 140, render: (_: any, r: Pool) => healthTag(r.health) },
    { title: 'Size', dataIndex: 'size', width: 140, render: (_: any, r: Pool) => bytes(r.size) },
    { title: 'Used', dataIndex: 'alloc', width: 140, render: (_: any, r: Pool) => bytes(r.alloc) },
    { title: 'Free', dataIndex: 'free', width: 140, render: (_: any, r: Pool) => bytes(r.free) },
    { title: 'Usage', key: 'usage', render: (_: any, r: Pool) => {
      const total = (r.size || 0);
      const used = (r.alloc || 0);
      const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;
      return <Progress percent={Number(pct.toFixed(1))} size="small" />;
    } },
  ];

  return (
    <PageContainer
      extra={[
        <Space key="act">
          <Button onClick={() => run()} loading={loading}>刷新</Button>
        </Space>
      ]}
    >
      <ProCard>
        <ProTable
          rowKey="name"
          search={false}
          dataSource={data || []}
          columns={columns}
          size="small"
          pagination={false}
        />
      </ProCard>
    </PageContainer>
  );
};

export default MonitorPage;


