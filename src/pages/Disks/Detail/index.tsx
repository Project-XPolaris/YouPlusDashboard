import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card} from "antd";
import type {IRouteComponentProps} from "@umijs/renderer-react";
import useDiskDetailModel from "@/pages/Disks/Detail/model";
import {useEffect, useState} from "react";
import type {ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import filesize from "filesize";
import AddPartitionDialog from "@/components/AddPartitionDialog";
type DiskDetailPageProps = IRouteComponentProps<{ name?: string },{}> & {

};
const DiskDetailPage = ({match}: DiskDetailPageProps) => {
  const model = useDiskDetailModel()
  const [addPartitionDialogVisible, setAddPartitionDialogVisible] = useState(false)
  useEffect(() => {
    if (match.params.name) {
      model.loadDisk(match.params.name)
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
    </PageContainer>
  )
}
export default DiskDetailPage
