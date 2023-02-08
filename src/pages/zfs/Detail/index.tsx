
import {Card, Col, List, Popconfirm, Row} from "antd";
import {useEffect} from "react";
import usePoolDetailModel from "@/pages/zfs/Detail/model";
import ZfsUsageCard from "@/components/ZfsUsageCard";
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {useParams} from "@@/exports";

const PoolDetailPage = () => {
  const params  = useParams();
  const model = usePoolDetailModel();
  useEffect(() => {
    if (params.name) {
      model.refresh(params.name);
      model.refreshDataset(params.name);
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
    <PageContainer title={params.name}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ZfsUsageCard info={model.pool}/>
        </Col>
        <Col span={24}>
          <Card title={"Disks"}>
            <List
              size="small"
              dataSource={model.getDiskList()}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Dataset">
            <ProTable
              loading={model.datasetListLoading}
              columns={colums}
              dataSource={model.datasetList}
              search={false}
            />
          </Card>
        </Col>
      </Row>

    </PageContainer>
  )
}
export default PoolDetailPage
