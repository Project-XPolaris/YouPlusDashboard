import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Table} from "antd";
import {useEffect, useState} from "react";
import CreateUserDialog from "@/components/CreateUserDialog";
import useAccountListModel from "@/pages/Account/List/model";
import type {ColumnsType} from "antd/es/table";
type UserItem = {
  username: string;
}
const UserListPage = () => {
  const model = useAccountListModel();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const userItems = model.accountList.map((username) => ({
    username,
  }))
  const accountColumns: ColumnsType<UserItem> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    }
  ]
  useEffect(() => {
    model.refresh()
  },[])
  return (
    <PageContainer
      extra={[
        <Button
          key="1"
          onClick={() => setCreateModalVisible(true)}
        >Add user</Button>,
      ]}
    >
      <CreateUserDialog
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={async ({username, password}) => {
          await model.create(username, password);
          setCreateModalVisible(false);
        }}
      />
      <Card>
        <Table dataSource={userItems} columns={accountColumns} />
      </Card>
    </PageContainer>
  )
}
export default UserListPage
