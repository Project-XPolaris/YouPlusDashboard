import {useEffect, useState} from 'react';
import {Card, Table, Tabs, Button, message, Descriptions} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PageContainer} from '@ant-design/pro-components';
import {fetchSMBStatus, restartSMB, fetchSMBInfo} from '@/services/ant-design-pro/sharefolder';

export default () => {
  const [loading, setLoading] = useState(false);
  const [processList, setProcessList] = useState<API.SMBProcess[]>([]);
  const [sharesList, setSharesList] = useState<API.SMBSharesStatus[]>([]);
  const [svc, setSvc] = useState<{name?: string; status?: string}>({});

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
      const [statusRes, infoRes] = await Promise.all([fetchSMBStatus(), fetchSMBInfo()]);
      setProcessList(statusRes?.process || []);
      setSharesList(statusRes?.shares || []);
      setSvc({name: infoRes?.name, status: infoRes?.status});
    } finally {
      setLoading(false);
    }
  }

  const doRestart = async () => {
    try {
      await restartSMB();
      message.success('SMB 重启指令已发送');
      setTimeout(refresh, 1500);
    } catch (e) {
      message.error('SMB 重启失败');
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  },[])

  return <PageContainer
    extra={[
      <Button key="restart" onClick={doRestart}>Restart</Button>
    ]}
  >
    <Card style={{ marginBottom: 16 }}>
      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="Service">{svc.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="Status">{svc.status || '-'}</Descriptions.Item>
      </Descriptions>
    </Card>
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


