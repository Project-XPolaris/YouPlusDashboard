import {Button, Card, Col, Row} from "antd";
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

    </PageContainer>
  )
}
export default DiskDetailPage
