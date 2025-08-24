import {useEffect, useMemo, useState} from 'react';
import {Badge, Card, Input, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PageContainer} from '@ant-design/pro-components';
import {fetchSystemServices} from '@/services/ant-design-pro/api';

export default () => {
  const [services, setServices] = useState<API.SystemService[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameQuery, setNameQuery] = useState('');
  const [namesInput, setNamesInput] = useState('smbd,nmbd,winbind,sshd,docker');

  const columns: ColumnsType<API.SystemService> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => {
      const color = v === 'Running' ? 'green' : v === 'Stopped' ? 'default' : 'warning';
      return <Badge status={v === 'Running' ? 'success' : v === 'Stopped' ? 'default' : 'warning'} text={v} color={color}/>;
    } },
  ];

  const filtered = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    return services.filter(s => !nq || s.name.toLowerCase().includes(nq));
  }, [services, nameQuery]);

  const refresh = async () => {
    setLoading(true);
    try {
      const names = namesInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetchSystemServices(names);
      setServices(res?.services || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  },[])

  return <PageContainer>
    <Card
      title={
        <Space size={[8,8]} wrap>
          <Input style={{width: 360}} value={namesInput} onChange={(e) => setNamesInput(e.target.value)} placeholder="Comma-separated service names e.g. smbd,nmbd,sshd"/>
          <Input allowClear style={{width: 200}} value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder="Filter by name"/>
        </Space>
      }
      extra={<a onClick={refresh}>Refresh</a>}
    >
      <Table rowKey={(r) => r.name} loading={loading} columns={columns} dataSource={filtered} pagination={false} />
    </Card>
  </PageContainer>
}


