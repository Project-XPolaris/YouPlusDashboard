import {useEffect, useMemo, useState} from 'react';
import {Card, Col, List, Progress, Row, Space, Statistic, Table, Tag} from 'antd';
import {PageContainer, StatisticCard} from '@ant-design/pro-components';
import filesize from 'filesize';
import {fetchFilesystems, fetchNetIO, fetchSystemLoad, fetchSystemMonitor, fetchSystemSensors, fetchSystemUptime} from '@/services/ant-design-pro/info';

export default () => {
  const [load, setLoad] = useState<{load1:number,load5:number,load15:number} | undefined>();
  const [uptime, setUptime] = useState<number>(0);
  const [fs, setFs] = useState<API.Filesystem[]>([]);
  const [netio, setNetio] = useState<API.NetIO[]>([]);
  const [sensors, setSensors] = useState<API.Sensor[]>([]);
  const [monitor, setMonitor] = useState<API.SystemMonitorResult['monitor'] | undefined>();

  const refresh = async () => {
    const [l, u, f, n, s, m] = await Promise.all([
      fetchSystemLoad(),
      fetchSystemUptime(),
      fetchFilesystems(),
      fetchNetIO(),
      fetchSystemSensors(),
      fetchSystemMonitor(),
    ]);
    setLoad(l as any);
    setUptime((u as any)?.uptimeSec || 0);
    setFs((f as any)?.filesystems || []);
    setNetio((n as any)?.netio || []);
    setSensors((s as any)?.sensors || []);
    setMonitor((m as any)?.monitor);
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [])

  return <PageContainer>
    <Row gutter={[16,16]}>
      <Col span={24}>
        <Space size={16} wrap>
          <StatisticCard
            statistic={{ title: 'Load 1/5/15', value: load ? `${load.load1.toFixed(2)} / ${load.load5.toFixed(2)} / ${load.load15.toFixed(2)}` : '-' }}
          />
          <StatisticCard
            statistic={{ title: 'Uptime', value: `${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m` }}
          />
          <StatisticCard
            statistic={{ title: 'CPU', value: monitor ? `${((1 - (monitor.cpu.idle/(monitor.cpu.total||1))) * 100).toFixed(1)}%` : '-' }}
          />
          <StatisticCard
            statistic={{ title: 'Memory', value: monitor ? `${((monitor.memory.used/(monitor.memory.total||1)) * 100).toFixed(1)}%` : '-' }}
          />
        </Space>
      </Col>
      <Col span={12}>
        <Card title="Filesystems">
          <Table
            rowKey={(r) => r.mount}
            dataSource={fs}
            size="small"
            pagination={false}
            columns={[
              { title: 'Mount', dataIndex: 'mount', key: 'mount' },
              { title: 'FS', dataIndex: 'fstype', key: 'fstype', width: 100 },
              { title: 'Used', key: 'used', render: (_, r) => `${filesize(r.used)} / ${filesize(r.total)} (${r.usedPercent.toFixed(1)}%)` },
              { title: 'Usage', key: 'usage', width: 160, render: (_, r) => <Progress percent={Math.min(100, Math.max(0, r.usedPercent))} size="small" status={r.usedPercent >= 90 ? 'exception' : r.usedPercent >= 75 ? 'active' : 'normal'} /> }
            ]}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Network IO">
          <Table
            rowKey={(r) => r.name}
            dataSource={netio}
            size="small"
            pagination={false}
            columns={[
              { title: 'IF', dataIndex: 'name', width: 120 },
              { title: 'Recv', dataIndex: 'bytesRecv', render: (v) => filesize(v) },
              { title: 'Sent', dataIndex: 'bytesSent', render: (v) => filesize(v) },
              { title: 'Err', key: 'err', render: (_, r) => `${r.errsIn}/${r.errsOut}` },
            ]}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="Sensors">
          <Table
            rowKey={(r) => r.sensorKey}
            dataSource={sensors}
            size="small"
            pagination={false}
            columns={[
              { title: 'Sensor', dataIndex: 'sensorKey' },
              { title: 'Temp', dataIndex: 'temperature', render: (v:number) => <Tag color={v>=90?'red':v>=75?'orange':v>=60?'gold':'green'}>{v.toFixed(1)} °C</Tag> },
              { title: 'High', dataIndex: 'high' },
              { title: 'Critical', dataIndex: 'critical' },
            ]}
          />
        </Card>
      </Col>
    </Row>
  </PageContainer>
}


