import {useEffect, useState} from 'react';
import {Card, Table, Tabs} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PageContainer} from '@ant-design/pro-components';
import {fetchSMBStatus} from '@/services/ant-design-pro/sharefolder';

export default () => {
  const [loading, setLoading] = useState(false);
  const [processList, setProcessList] = useState<API.SMBProcess[]>([]);
  const [sharesList, setSharesList] = useState<API.SMBSharesStatus[]>([]);

  const processColumns: ColumnsType<API.SMBProcess> = [
    { title: 'PID', dataIndex: 'pid', key: 'pid', width: 120 },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Group', dataIndex: 'group', key: 'group' },
    { title: 'Machine', dataIndex: 'machine', key: 'machine' },
  ];
  const sharesColumns: ColumnsType<API.SMBSharesStatus> = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 200 },
    { title: 'PID', dataIndex: 'pid', key: 'pid', width: 120 },
    { title: 'Machine', dataIndex: 'machine', key: 'machine' },
    { title: 'Connect At', dataIndex: 'connectAt', key: 'connectAt', width: 220 },
  ];

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchSMBStatus();
      setProcessList(res?.process || []);
      setSharesList(res?.shares || []);
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
    <Tabs
      defaultActiveKey="process"
      items={[
        {
          key: 'process',
          label: 'Processes',
          children: <Card><Table rowKey="pid" loading={loading} dataSource={processList} columns={processColumns} pagination={false} size="small"/></Card>
        },
        {
          key: 'shares',
          label: 'Shares',
          children: <Card><Table rowKey={(r) => r.service + r.pid} loading={loading} dataSource={sharesList} columns={sharesColumns} pagination={false} size="small"/></Card>
        }
      ]}
    />
  </PageContainer>
}


