import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {history} from "umi";
import useAppListModel from "@/pages/App/List/model";
import {useEffect} from "react";
import type {ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";

const AppListPage = () => {
  const model = useAppListModel()
  useEffect(() => {
    model.refresh()
  },[])
  const columns: ProColumns<API.App>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'type',
      dataIndex: 'type',
    },
    {
      title: 'status',
      dataIndex: 'status',
    },
    {
      title: 'action',
      valueType: 'option',
      render: (_, record) => {
        return (
          <>
            {
              record.status === 'Running' ?
                <a onClick={() => model.stop(record.id)}>Stop</a> :
                <a onClick={() => model.start(record.id)}>Start</a>
            }
          </>
        )
      }
    }
  ]
  return (
    <PageContainer
      extra={[
        <Button key="1" onClick={() => history.push("/app/create")}>
          <PlusOutlined />
          Add
        </Button>,
      ]}
    >
      <Card>
        <ProTable columns={columns} dataSource={model.apps} search={false}/>
      </Card>

    </PageContainer>
  )
}
export default AppListPage
