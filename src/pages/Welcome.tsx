import React, {useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import DeviceBaseStatisticsCard from "@/components/DeviceBaseStatisticsCard";
import {fetchDeviceInfo, fetchSystemMonitor} from "@/services/ant-design-pro/info";
import SimpleCpuCard from "@/components/SimpleCpuCard";
import {Col, Row} from "antd";
import styles from './Welcome.less';
import SimpleMemoryCard from "@/components/SimpleMemoryCard";
import {useRequest} from "ahooks";
const Welcome: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = React.useState<API.DeviceInfo | null>(null);
  const loadDeviceInfo = async () => {
    const response = await fetchDeviceInfo();
    if (!response.reason) {
      setDeviceInfo(response);
    }
  }
  const systemMonitor = useRequest(fetchSystemMonitor, {
    pollingInterval: 3000,
  });
  useEffect(() => {
    loadDeviceInfo()
    systemMonitor.run();
  },[])
  return (
    <PageContainer>
      <Row className={styles.row} gutter={8}>
        <Col span={24}>
          <DeviceBaseStatisticsCard info={deviceInfo} />
        </Col>
      </Row>
      <Row className={styles.row} gutter={8}>
        <Col span={6}>
          <SimpleCpuCard info={systemMonitor.data?.monitor.cpu}  />
        </Col>
        <Col span={6}>
          <SimpleMemoryCard info={systemMonitor.data?.monitor.memory} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
