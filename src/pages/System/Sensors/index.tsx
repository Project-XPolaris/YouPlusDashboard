import {useEffect, useMemo, useState} from 'react';
import {Badge, Card, Input, Space, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PageContainer} from '@ant-design/pro-components';
import {fetchSystemSensors} from '@/services/ant-design-pro/info';

const colorByTemp = (t: number) => {
  if (t >= 90) return 'red';
  if (t >= 75) return 'orange';
  if (t >= 60) return 'gold';
  return 'green';
}

export default () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.Sensor[]>([]);
  const [query, setQuery] = useState('');

  const columns: ColumnsType<API.Sensor> = [
    { title: 'Sensor', dataIndex: 'sensorKey', key: 'sensorKey', width: 380 },
    { title: 'Temp (°C)', dataIndex: 'temperature', key: 'temperature', render: (v: number) => <Tag color={colorByTemp(v)}>{v.toFixed(1)}</Tag> },
    { title: 'High (°C)', dataIndex: 'high', key: 'high', render: (v?: number) => (typeof v === 'number' && v > 0 ? v.toFixed(1) : '-') },
    { title: 'Critical (°C)', dataIndex: 'critical', key: 'critical', render: (v?: number) => (typeof v === 'number' && v > 0 ? v.toFixed(1) : '-') },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter(s => !q || s.sensorKey.toLowerCase().includes(q));
  }, [list, query]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchSystemSensors();
      setList(res?.sensors || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [])

  return <PageContainer>
    <Card
      title={<Space><span>Sensors</span></Space>}
      extra={<Space><Input allowClear placeholder="Filter key" value={query} onChange={(e) => setQuery(e.target.value)} style={{width: 240}}/><a onClick={refresh}>Refresh</a></Space>}
    >
      <Table rowKey={(r) => r.sensorKey} loading={loading} columns={columns} dataSource={filtered} pagination={false} size="small"/>
    </Card>
  </PageContainer>
}


