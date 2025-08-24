import {useEffect, useMemo, useState} from 'react';
import {Badge, Button, Card, Input, Space, Table, message} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PageContainer} from '@ant-design/pro-components';
import {enableSystemUser, fetchSystemUsers} from '@/services/ant-design-pro/api';

export default () => {
  const [users, setUsers] = useState<API.SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameQuery, setNameQuery] = useState('');

  const columns: ColumnsType<API.SystemUser> = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'UID', dataIndex: 'uid', key: 'uid', width: 120 },
    { title: 'Status', key: 'status', render: (_, r) => (
      r.isYouPlusUser ? <Badge status="success" text="YouPlus"/> : <Badge status="default" text="System Only" />
    ) },
    { title: 'Action', key: 'action', width: 160, render: (_, r) => (
      <Space>
        <Button
          type="primary"
          size="small"
          disabled={r.isYouPlusUser}
          onClick={async () => {
            try {
              await enableSystemUser(r.username);
              message.success('已启用为 YouPlus 用户');
              await refresh();
            } catch (e) {
              message.error('操作失败');
            }
          }}
        >启用</Button>
      </Space>
    ) },
  ];

  const filtered = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    return users.filter(s => !nq || s.username.toLowerCase().includes(nq));
  }, [users, nameQuery]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchSystemUsers();
      setUsers(res?.users || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  },[])

  return <PageContainer>
    <Card
      title={
        <Space size={[8,8]} wrap>
          <Input allowClear style={{width: 240}} value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} placeholder="Filter by username"/>
        </Space>
      }
      extra={<a onClick={refresh}>Refresh</a>}
    >
      <Table rowKey={(r) => r.username} loading={loading} columns={columns} dataSource={filtered} pagination={{ pageSize: 20 }} />
    </Card>
  </PageContainer>
}


