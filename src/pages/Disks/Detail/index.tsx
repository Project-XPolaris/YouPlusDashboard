import {Button, Card, Col, Descriptions, Row, Tabs} from "antd";
import useDiskDetailModel from "@/pages/Disks/Detail/model";
import {useEffect, useState} from "react";
import filesize from "filesize";
import AddPartitionDialog from "@/components/AddPartitionDialog";
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {useParams} from "@@/exports";

const DiskDetailPage = () => {
  const params  = useParams();
  const model = useDiskDetailModel()
  const [addPartitionDialogVisible, setAddPartitionDialogVisible] = useState(false)
  useEffect(() => {
    console.log(params)
    if (params.name) {
      model.loadDisk(params.name)
    }
  },[])
  const partColumns: ProColumns<API.DiskPart>[]  = [
    {
      title: 'name',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: 'size',
      dataIndex: 'size',
      renderText: (text) => filesize(text),
    },
    {
      title: 'Action',
      dataIndex: 'name',
      render: (text, record,idx) => (
        <>
          <Button type="link" onClick={async () => {
            await model.removeDiskPartition(idx)
          }}>Delete</Button>
        </>
      ),
    }
  ]
  return (
    <PageContainer>
      <AddPartitionDialog
        visible={addPartitionDialogVisible}
        onCancel={() => setAddPartitionDialogVisible(false)}
        onOk={async ({size}) => {
          await model.appendDiskPartition(size)
          setAddPartitionDialogVisible(false)
        }}
      />
      <Row gutter={[0,16]}>
        <Col span={24}>
          <Card title={"Partition"}>
            <ProTable
              search={false}
              columns={partColumns}
              dataSource={model.disk?.parts}
              toolBarRender={() => [
                <Button key="add" onClick={() => setAddPartitionDialogVisible(true)}>添加分区</Button>,
              ]}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[0,16]}>
        <Col span={24}>
          <Card title={"SMART 信息"}>
            <Tabs>
              <Tabs.TabPane tab="概要" key="summary">
                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label="Model Family">{model.smart?.model_family || model.smart?.modelFamily}</Descriptions.Item>
                  <Descriptions.Item label="Model">{model.smart?.model_name || model.smart?.modelName}</Descriptions.Item>
                  <Descriptions.Item label="Serial">{model.smart?.serial_number || model.smart?.serialNumber}</Descriptions.Item>
                  <Descriptions.Item label="Firmware">{model.smart?.firmware_version || model.smart?.firmwareVersion}</Descriptions.Item>
                  <Descriptions.Item label="Overall Health">{model.smart?.smart_status?.passed?.toString()}</Descriptions.Item>
                </Descriptions>
              </Tabs.TabPane>
              <Tabs.TabPane tab="属性" key="attrs">
                <ProTable
                  rowKey={(r: any) => r.id || r.attribute_id}
                  search={false}
                  pagination={{ pageSize: 10 }}
                  columns={[
                    { title: 'ID', dataIndex: ['id'], render: (_: any, r: any) => r.id || r.attribute_id },
                    { title: 'Name', dataIndex: ['name'] },
                    { title: 'Value', dataIndex: ['value'] },
                    { title: 'Worst', dataIndex: ['worst'] },
                    { title: 'Thresh', dataIndex: ['threshold'] },
                    { title: 'Raw', dataIndex: ['raw', 'string'], render: (_: any, r: any) => r.raw?.string },
                  ]}
                  dataSource={model.smart?.ata_smart_attributes?.table || []}
                  size="small"
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="原始JSON" key="raw">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(model.smart || {}, null, 2)}</pre>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

    </PageContainer>
  )
}
export default DiskDetailPage
