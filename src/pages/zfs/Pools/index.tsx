import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Popconfirm, Table} from "antd";
import CreateSimpleZFSPoolDialog from "@/components/CreateSmpleZFSPoolDialog";
import {useEffect, useState} from "react";
import type {ZFSPoolItem} from "@/pages/zfs/Pools/model";
import useZFSPoolsModel from "@/pages/zfs/Pools/model";
import type {ColumnsType} from "antd/es/table";
import filesize from "filesize";
import styles from './index.less'
import CreatePoolForm from "@/components/CreaetPoolForm";
import {Link} from "umi";
const ZFSPoolsPage = () => {
  const model = useZFSPoolsModel()
  const [createZFSPoolDialogVisible, setCreateZFSPoolDialogVisible] = useState(false);
  const [createPoolFormVisible, setCreatePoolFormVisible] = useState(false);
  const zfsPoolsColumns: ColumnsType<ZFSPoolItem> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/zfs/pool/${record.name}`}>{text}</Link>,
    },
    {
      title: 'Size',
      key: 'size',
      dataIndex: 'size',
      render: (value: number) => filesize(value)
    },
    {
      title: 'Used',
      key: 'used',
      dataIndex: 'alloc',
      render: (value: number) => filesize(value)
    },
    {
      title: 'Free',
      key: 'free',
      dataIndex: 'free',
      render: (value: number) => filesize(value)
    },
    {
      title: 'Action',
      key: 'action',
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Are you sure delete this ZFS pool?"
              onConfirm={() => model.deletePool(record.name)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#" className={styles.action}>Delete</a>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  useEffect(() => {
    model.refresh()
  },[])
  return (
    <PageContainer
      extra={[
        <Button key="1" onClick={() => setCreateZFSPoolDialogVisible(true)}>快速创建卷池</Button>,
        <Button key="2" onClick={() => setCreatePoolFormVisible(true)}>创建卷池</Button>,
      ]}
    >
      <CreateSimpleZFSPoolDialog
        visible={createZFSPoolDialogVisible}
        onCancel={() => setCreateZFSPoolDialogVisible(false)}
        onOk={({name,disks}) => {
          setCreateZFSPoolDialogVisible(false);
          model.createPool(name,disks);
        }}
      />
      <CreatePoolForm
        visible={createPoolFormVisible}
        onClose={() => setCreatePoolFormVisible(false)}
        onSubmit={async (values) => {
          await model.createWithConfig(values);
          setCreatePoolFormVisible(false);
        }}
      />
      <Card>
        <Table columns={zfsPoolsColumns} dataSource={model.getZPools()} />
      </Card>
    </PageContainer>
  )
}
export default ZFSPoolsPage
