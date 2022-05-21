import {PageContainer} from "@ant-design/pro-layout";
import type {ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type {IRouteComponentProps} from "@umijs/renderer-react";
import {Card, Popconfirm} from "antd";
import {useEffect} from "react";
import usePoolDetailModel from "@/pages/zfs/Detail/model";

type PoolDetailPageProps = IRouteComponentProps<{ name?: string }, {}> & {};
const PoolDetailPage = ({match}: PoolDetailPageProps) => {
  const model = usePoolDetailModel();
  useEffect(() => {
    if (match.params.name) {
      model.refresh(match.params.name);
      model.refreshDataset(match.params.name);
    }
  }, [])
  const colums: ProColumns<API.Dataset>[] = [
    {
      title: 'Path',
      dataIndex: 'path',
      valueType: 'text',
    },
    {
      title: 'Action',
      dataIndex: 'path',
      render: (text, record) => {
        return <>
          <Popconfirm
            title="Create with this dataset?"
            onConfirm={() => model.setAsStorage(record.path)}
            okText="Yes"
            cancelText="No"
          >
            <a>SetAsStorage</a>
          </Popconfirm>
        </>
      }
    }
  ]
  return (
    <PageContainer title={match.params.name}>
      <Card title="Dataset">
        <ProTable
          loading={model.datasetListLoading}
          columns={colums}
          dataSource={model.datasetList}
          search={false}
        />
      </Card>
    </PageContainer>
  )
}
export default PoolDetailPage
