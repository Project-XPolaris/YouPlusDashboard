
import {Card, Col, List, Popconfirm, Row, Table, Tree} from "antd";
import {useEffect} from "react";
import usePoolDetailModel from "@/pages/zfs/Detail/model";
import ZfsUsageCard from "@/components/ZfsUsageCard";
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {useParams} from "@@/exports";
import filesize from "filesize";

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
  const shareColumns = [
    { title: 'Name', dataIndex: 'name', width: 200 },
    { title: 'Path', dataIndex: 'path' },
  ];
  const buildVdevTree = (node?: API.Vdev): any[] => {
    if (!node) return [];
    const title = `${node.name} (${node.type}) - alloc ${filesize(node.alloc || 0)} / size ${filesize(node.size || 0)}${node.path ? ` - ${node.path}` : ''}`;
    const children: any[] = [];
    if (node.devices && node.devices.length) {
      children.push(...node.devices.map((d, idx) => buildVdevTree(d)[0]));
    }
    if (node.l2Cache && node.l2Cache.length) {
      children.push(...node.l2Cache.map((d, idx) => ({ key: `${d.path || d.name}-l2-${idx}` , title: `L2: ${d.name} (${d.type}) - ${filesize(d.size || 0)}`, children: buildVdevTree(d) })));
    }
    if (node.spares && node.spares.length) {
      children.push(...node.spares.map((d, idx) => ({ key: `${d.path || d.name}-spare-${idx}` , title: `Spare: ${d.name} (${d.type}) - ${filesize(d.size || 0)}`, children: buildVdevTree(d) })));
    }
    return [{ key: node.path || node.name || Math.random().toString(36).slice(2), title, children }];
  }
  return (
    <PageContainer title={params.name}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ZfsUsageCard info={model.pool}/>
        </Col>
        {model.pool?.tree ? (
          <Col span={24}>
            <Card title="VDEVs">
              <Tree treeData={buildVdevTree(model.pool.tree)} defaultExpandAll />
            </Card>
          </Col>
        ) : null}
        {model.pool && (model.pool as any).shares?.length ? (
          <Col span={24}>
            <Card title="Share Folders">
              <Table
                rowKey={(r: any) => r.name}
                dataSource={(model.pool as any).shares}
                pagination={false}
                size="small"
                columns={shareColumns as any}
              />
            </Card>
          </Col>
        ) : null}
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
