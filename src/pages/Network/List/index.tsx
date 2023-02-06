import {PageContainer} from "@ant-design/pro-layout";
import useNetworkListModel from "@/pages/Network/List/model";
import {useEffect} from "react";
import {Card, Col, Row} from "antd";
import ProDescriptions from "@ant-design/pro-descriptions";
import {networkCapacityToHuman} from "@/utils/number";

const NetworkListPage = () => {
  const model = useNetworkListModel()
  useEffect(() => {
    model.refresh()
  }, [])
  return (
    <PageContainer>
      <Row gutter={[0, 16]}>
        {
          model.networks.map((network) => {
            return (
              <Col span={24} key={network.name}>
                <Card title={network.name}>
                  <Row gutter={[16,16]}>
                    <Col span={12}>
                      <ProDescriptions title="Status" column={1}>
                        <ProDescriptions.Item label="IPv4">
                          {network.IPv4Address}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item
                          label="UseDHCP(IPv4)">{network.IPv4Config.dhcp ? "yes" : "no"}</ProDescriptions.Item>
                        <ProDescriptions.Item label="IPv6">
                          {network.IPv6Address}

                        </ProDescriptions.Item>
                        <ProDescriptions.Item
                          label="UseDHCP(IPv6)">{network.IPv6Config.dhcp ? "yes" : "no"}</ProDescriptions.Item>

                      </ProDescriptions>
                    </Col>
                    <Col span={12}>
                      <ProDescriptions title="Hardware" column={1}>
                        <ProDescriptions.Item label="Product">
                          {network.hardwareInfo.product}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item label="Vendor">
                          {network.hardwareInfo.vendor}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item label="Serial">
                          {network.hardwareInfo.serial}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item label="Cap">
                          {networkCapacityToHuman(network.hardwareInfo.capacity)}
                        </ProDescriptions.Item>
                      </ProDescriptions>
                    </Col>
                  </Row>
                </Card>
              </Col>
            )
          })
        }
      </Row>
    </PageContainer>
  )
}
export default NetworkListPage
