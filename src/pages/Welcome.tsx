import React, {useEffect, useMemo, useState} from 'react';
import {PageContainer, StatisticCard} from '@ant-design/pro-components';
import DeviceBaseStatisticsCard from "@/components/DeviceBaseStatisticsCard";
import {
  fetchDeviceInfo,
  fetchFilesystems,
  fetchNetIO,
  fetchSystemLoad,
  fetchSystemMonitor,
  fetchSystemSensors,
  fetchSystemUptime
} from "@/services/ant-design-pro/info";
import SimpleCpuCard from "@/components/SimpleCpuCard";
import {Card, Col, List, Progress, Row, Table, Tag} from "antd";
import styles from './Welcome.less';
import SimpleMemoryCard from "@/components/SimpleMemoryCard";
import {useRequest} from "ahooks";
import filesize from 'filesize';
import {fetchStorageList} from "@/services/ant-design-pro/storage";
import {fetchSMBStatus} from "@/services/ant-design-pro/sharefolder";
import {fetchZFSPoolList} from "@/services/ant-design-pro/zfs";
import {fetchTaskList} from "@/services/ant-design-pro/info";
import type {ColumnsType} from 'antd/es/table';
const Welcome: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = React.useState<API.DeviceInfo | null>(null);
  const [load, setLoad] = useState<{ load1:number, load5:number, load15:number }>();
  const [uptimeSec, setUptimeSec] = useState<number>(0);
  const [filesystems, setFilesystems] = useState<API.Filesystem[]>([]);
  const [netio, setNetio] = useState<API.NetIO[]>([]);
  const [sensors, setSensors] = useState<API.Sensor[]>([]);
  const [storageSummary, setStorageSummary] = useState<{used:number,total:number}>({used:0,total:0});
  const [storageList, setStorageList] = useState<API.Storage[]>([]);
  const [smbProcessCount, setSmbProcessCount] = useState<number>(0);
  const [smbShareCount, setSmbShareCount] = useState<number>(0);
  const [zfsPools, setZfsPools] = useState<API.ZPool[]>([]);
  const [tasks, setTasks] = useState<API.Task[]>([]);
  const loadDeviceInfo = async () => {
    const response = await fetchDeviceInfo();
    if (!response.reason) {
      setDeviceInfo(response);
    }
  }
  const systemMonitor = useRequest(fetchSystemMonitor, {
    pollingInterval: 3000,
  });
  const refreshOverview = async () => {
    const [l, u, fs, ni, ss, st, smb, zp, tk] = await Promise.all([
      fetchSystemLoad(),
      fetchSystemUptime(),
      fetchFilesystems(),
      fetchNetIO(),
      fetchSystemSensors(),
      fetchStorageList(),
      fetchSMBStatus(),
      fetchZFSPoolList(),
      fetchTaskList(),
    ]);
    setLoad(l as any);
    setUptimeSec((u as any)?.uptimeSec || 0);
    setFilesystems((fs as any)?.filesystems || []);
    setNetio((ni as any)?.netio || []);
    setSensors((ss as any)?.sensors || []);
    const storages = (st as any)?.storages || [];
    const used = storages.reduce((sum: number, s: API.Storage) => sum + (s.used||0), 0);
    const total = storages.reduce((sum: number, s: API.Storage) => sum + (s.total||0), 0);
    setStorageSummary({used,total});
    setStorageList(storages);
    setSmbProcessCount(((smb as any)?.process || []).length);
    setSmbShareCount(((smb as any)?.shares || []).length);
    setZfsPools(((zp as any)?.pools) || []);
    setTasks(((tk as any)?.tasks || []).slice(0,5));
  }
  useEffect(() => {
    loadDeviceInfo()
    systemMonitor.run();
    refreshOverview();
    const t = setInterval(refreshOverview, 5000);
    return () => clearInterval(t);
  },[])
  const fsColumns: ColumnsType<API.Filesystem> = useMemo(() => ([
    { title: 'Mount', dataIndex: 'mount', key: 'mount' },
    { title: 'FS', dataIndex: 'fstype', key: 'fstype', width: 100 },
    { title: 'Used', key: 'used', render: (_, r) => `${filesize(r.used)} / ${filesize(r.total)} (${r.usedPercent.toFixed(2)}%)` },
    { title: 'Usage', key: 'usage', width: 180, render: (_, r) => (
      <Progress
        percent={Math.min(100, Math.max(0, r.usedPercent))}
        size="small"
        status={r.usedPercent >= 90 ? 'exception' : r.usedPercent >= 75 ? 'active' : 'normal'}
        format={(p) => `${(p || 0).toFixed(2)}%`}
      />
    ) },
  ]),[])
  return (
    <PageContainer>
      <Row className={styles.row} gutter={8}>
        <Col span={24}>
          <DeviceBaseStatisticsCard info={deviceInfo} />
        </Col>
      </Row>
      <Row className={styles.row} gutter={8}>
        <Col span={6}>
          <div style={{height: 140}}>
            <SimpleCpuCard info={systemMonitor.data?.monitor.cpu}  />
          </div>
        </Col>
        <Col span={6}>
          <div style={{height: 140}}>
            <SimpleMemoryCard info={systemMonitor.data?.monitor.memory} />
          </div>
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Load"
            statistic={{ value: load ? `${load.load1.toFixed(2)} / ${load.load5.toFixed(2)} / ${load.load15.toFixed(2)}` : '-', description: '1/5/15 min' }}
            style={{height: 140}}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Uptime"
            statistic={{ value: `${Math.floor(uptimeSec/3600)}h ${Math.floor((uptimeSec%3600)/60)}m`, description: 'since boot' }}
            style={{height: 140}}
          />
        </Col>
      </Row>
      <Row className={styles.row} gutter={8}>
        <Col span={12}>
          <Card title="Filesystems" bodyStyle={{padding: 12, height: 360, overflow: 'hidden'}}>
            <Table
              size="small"
              pagination={false}
              rowKey={(r) => r.mount}
              dataSource={filesystems}
              columns={fsColumns}
              scroll={{ y: 312 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Network IO" bodyStyle={{padding: 12, height: 360, overflow: 'hidden'}}>
            <Table
              size="small"
              pagination={false}
              rowKey={(r) => r.name}
              dataSource={netio}
              columns={[
                { title: 'IF', dataIndex: 'name', width: 120 },
                { title: 'Recv', dataIndex: 'bytesRecv', render: (v: number) => filesize(v) },
                { title: 'Sent', dataIndex: 'bytesSent', render: (v: number) => filesize(v) },
                { title: 'Err', key: 'err', render: (_: any, r: API.NetIO) => `${r.errsIn}/${r.errsOut}` },
              ] as any}
              scroll={{ y: 312 }}
            />
          </Card>
        </Col>
      </Row>
      <Row className={styles.row} gutter={8}>
        <Col span={24}>
          <StatisticCard
            title="Storage"
            style={{height: 180}}
            statistic={{ value: storageSummary.total ? `${filesize(storageSummary.used)} / ${filesize(storageSummary.total)}` : '-', description: 'All storages' }}
            chart={<Progress percent={storageSummary.total ? Math.min(100, (storageSummary.used / storageSummary.total) * 100) : 0} format={(p) => `${(p||0).toFixed(2)}%`} />}
          />
        </Col>
      </Row>
      <Row className={styles.row} gutter={8}>
        <Col span={12}>
          <Card title="Sensors" bodyStyle={{padding: 12, height: 240, overflow: 'hidden'}}>
            <Table
              size="small"
              pagination={false}
              rowKey={(r) => r.sensorKey}
              dataSource={sensors}
              columns={[
                { title: 'Sensor', dataIndex: 'sensorKey' },
                { title: 'Temp', dataIndex: 'temperature', render: (v:number) => <Tag color={v>=90?'red':v>=75?'orange':v>=60?'gold':'green'}>{v.toFixed(2)} °C</Tag> },
              ] as any}
              scroll={{ y: 192 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Storages" bodyStyle={{padding: 12, height: 240, overflow: 'hidden'}}>
            <Table
              size="small"
              pagination={false}
              rowKey={(r) => r.id}
              dataSource={storageList}
              columns={[
                { title: 'Name', dataIndex: 'name', width: 140 },
                { title: 'Type', dataIndex: 'type', width: 90 },
                { title: 'Usage', key: 'usage', render: (_: any, r: API.Storage) => {
                  const pct = r.total ? (r.used / r.total) * 100 : 0;
                  return <Progress percent={pct} size="small" format={(p) => `${(p||0).toFixed(2)}%`} />
                } },
              ] as any}
              scroll={{ y: 192 }}
            />
          </Card>
        </Col>
      </Row>
      <Row className={styles.row} gutter={8}>
        <Col span={24}>
          <Card title="SMB / Tasks / ZFS" style={{height: 300}} bodyStyle={{padding: 12, height: 300, overflow: 'hidden'}}>
            <div style={{display: 'flex', gap: 12, marginBottom: 12}}>
              <StatisticCard statistic={{ title: 'SMB Proc', value: smbProcessCount }} style={{flex: 1}} />
              <StatisticCard statistic={{ title: 'SMB Conn', value: smbShareCount }} style={{flex: 1}} />
              <StatisticCard statistic={{ title: 'ZFS Pools', value: zfsPools.length }} style={{flex: 1}} />
            </div>
            <div style={{height: 220, overflowY: 'auto'}}>
              <List
                size="small"
                header={"Recent Tasks"}
                dataSource={tasks}
                renderItem={(t) => (<List.Item>
                  <span style={{marginRight: 8}}>{t.id}</span>
                  <Tag color={t.status === 'Done' ? 'green' : t.status === 'Error' ? 'red' : 'blue'}>{t.status}</Tag>
                  <span style={{marginLeft: 8}}>{t.type}</span>
                </List.Item>)}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
