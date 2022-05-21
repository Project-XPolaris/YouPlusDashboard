import {PageContainer} from "@ant-design/pro-layout";
import {Card, Popconfirm} from "antd";
import useStorageList from "@/pages/Storage/List/model";
import filesize from "filesize";
import {useEffect, useState} from "react";
import styles from "./index.less";
import ProTable, {ProColumns} from "@ant-design/pro-table";
import UpdateStorageForm from "@/components/UpdateStorageForm";

const StorageListPage = () => {
  const model = useStorageList()
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [updateFormValues, setUpdateFormValues] = useState<API.Storage | undefined>()
  const storageListColumns: ProColumns<API.Storage>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },{
      title: 'Used',
      dataIndex: 'used',
      key: 'used',
      render: (value,data) => filesize(data.used)
    },{
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value,data) => filesize(data.total)
    },
    {
      title: 'Action',
      key: 'action',
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Are you sure delete this storage?"
              onConfirm={() => model.deleteWithId(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#" className={styles.action}>Delete</a>
            </Popconfirm>
            <a onClick={() => {
              setUpdateFormValues(record)
              setUpdateModalVisible(true)
            }}>Edit</a>
          </div>
        )
      }
    }
  ]
  useEffect(() => {
    model.refresh()
  },[])
  return (
    <PageContainer>
      <UpdateStorageForm
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onSubmit={async (values) => {
          if (updateFormValues) {
            await model.update(updateFormValues.id, values)
          }
          setUpdateModalVisible(false)
        }}
        initialValues={updateFormValues}
      />
      <Card>
        <ProTable dataSource={model.storageList} columns={storageListColumns} search={false} />
      </Card>
    </PageContainer>
  )

}
export default StorageListPage
