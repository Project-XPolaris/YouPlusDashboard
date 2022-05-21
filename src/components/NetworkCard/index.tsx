import ProCard from "@ant-design/pro-card";
import {Descriptions} from "antd";

const NetworkCard =  ({ info }: { info: API.Network }) => {
  return (
    <ProCard
      title={info.name}
      subTitle={info.hardwareInfo.product}
    >
      <Descriptions>
        <Descriptions.Item label="IPv4">{info.hardwareInfo.configuration.ip}</Descriptions.Item>
      </Descriptions>
    </ProCard>
  )
}
export default NetworkCard
