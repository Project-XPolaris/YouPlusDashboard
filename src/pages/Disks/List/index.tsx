import {PageContainer} from "@ant-design/pro-layout";
import useDiskListModel from "@/pages/Disks/List/model";
import {Card} from "antd";
import {useEffect} from "react";
import filesize from "filesize";
import {Link} from "umi";
import type {ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";

const DiskListPage = () => {
  const model= useDiskListModel()
  const columns: ProColumns<API.Disk>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/disk/${record.name}/info`}>{record.name}</Link>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (text,record) => filesize(Number(record.size ?? 0)),
    }
  ]
  useEffect(() => {
    model.refresh()
  },[])
  return (
   <PageContainer>

     <Card>
       <ProTable columns={columns} dataSource={model.disks} search={false}/>
     </Card>
   </PageContainer>
  )
}
export default DiskListPage
