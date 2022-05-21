import {PageContainer} from "@ant-design/pro-layout";
import type {IRouteComponentProps} from "@umijs/renderer-react";
import useGroupDetail from "@/pages/Account/GroupDetail/model";
import {useEffect, useState} from "react";
import {Button, Card, Space} from "antd";
import SelectAccountDialog from "@/components/SelectAccountDialog";
import ProTable, {ProColumns} from "@ant-design/pro-table";

type GroupDetailProps = IRouteComponentProps<{ name?: string }> & {}
const GroupDetail = ({match}: GroupDetailProps) => {
  const model = useGroupDetail()
  const [selectAccountDialogVisible, setSelectAccountDialogVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<API.GroupUser[]>([])
  useEffect(() => {
    if (match.params.name) {
      model.refresh(match.params.name)
    }
  }, [])
  if (!model.group) {
    return <></>
  }
  const columns: ProColumns<API.GroupUser>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Uid",
      dataIndex: 'uid',
      key: 'uid',
    }
  ]
  const onRemoveSelectAccount = async () => {
    if (model.group?.name) {
      await model.removeUser(model.group?.name,selectedAccount.map(item => item.name))
      setSelectedAccount([])
    }
  }
  return (
    <PageContainer
      title={model.group.name}
    >
      <SelectAccountDialog
        visible={selectAccountDialogVisible}
        onCancel={() => setSelectAccountDialogVisible(false)}
        onOk={async (values) => {
          if (model.group?.name && model.group?.name && values?.account) {
            const addUser = values.account.filter((account) =>
              (model.group?.users ?? []).findIndex((user) => user.name === account) === -1
            )
            await model.addUser(model.group?.name, addUser)
            setSelectAccountDialogVisible(false)
          }
        }}
        initialValues={{account: model.group.users?.map(it => it.name)}}
      />
      <Card
        title={"Users"}
        extra={[
          <Button onClick={() => setSelectAccountDialogVisible(true)} key={"addUser"}>
            Add user
          </Button>
        ]}
      >
        <ProTable<API.GroupUser>
          dataSource={model.group.users}
          options={{
            reload:async () => {
              if (model.group?.name) {
                await model.refresh(model.group.name)
              }
            },
          }}
          search={false}
          columns={columns}
          rowKey={(it) => it.name}
          tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a onClick={onRemoveSelectAccount}>批量删除</a>
              </Space>
            );
          }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedAccount(selectedRows)
            },
            selectedRowKeys: selectedAccount.map(it => it.name)
          }}
        />
      </Card>
    </PageContainer>
  )
}
export default GroupDetail
