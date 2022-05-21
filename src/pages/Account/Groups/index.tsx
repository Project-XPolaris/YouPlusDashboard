import {PageContainer} from "@ant-design/pro-layout";
import CreateAccountGroupDialog from "@/components/CreateAccountGroupDialog";
import {useEffect, useState} from "react";
import {Button, Card, Popconfirm, Table} from "antd";
import useAccountGroupsModel from "@/pages/Account/Groups/model";
import {ColumnsType} from "antd/es/table";
import styles from "@/pages/Storage/List/index.less";
import {Link} from "umi";

const AccountGroupsPage = () => {
  const model = useAccountGroupsModel()
  const [createAccountGroupDialogVisible, setCreateAccountGroupDialogVisible] = useState(false);
  useEffect(() => {
    model.refresh()
  },[])
  const accountGroupsColumn: ColumnsType<API.Group> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/account/group/${record.name}`}>{text}</Link>
    },
    {
      title: 'Gid',
      dataIndex: 'gid',
      key: 'gid',
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Action',
      key: 'action',
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Are you sure delete this group?"
              onConfirm={() => model.remove(record.name)}
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
  return (
    <PageContainer
      extra={[
        <Button
          key="create"
          onClick={() => setCreateAccountGroupDialogVisible(true)}
        >Create</Button>
      ]}
    >
      <CreateAccountGroupDialog
        visible={createAccountGroupDialogVisible}
        onCancel={() => setCreateAccountGroupDialogVisible(false)}
        onOk={async ({name}) => {
          await model.add(name)
          setCreateAccountGroupDialogVisible(false)
        }}
      />
      <Card>
        <Table dataSource={model.accountGroups} columns={accountGroupsColumn} />
      </Card>
    </PageContainer>
  )
}
export default AccountGroupsPage
