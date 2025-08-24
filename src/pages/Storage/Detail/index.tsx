import {Card, Col, List, Row} from "antd";
import {PageContainer, ProDescriptions} from "@ant-design/pro-components";
import {useEffect, useState} from "react";
import {useParams} from "@@/exports";
import {history} from '@umijs/max'
import {fetchStorageDetail} from "@/services/ant-design-pro/storage";
import StorageUseageCard from "@/components/StorageUseageCard";

const StorageDetailPage = () => {
  const params = useParams();
  const [detail, setDetail] = useState<API.StorageDetail | undefined>();

  const refresh = async (id: string) => {
    const res = await fetchStorageDetail(id)
    if (res?.data) {
      setDetail(res.data)
    }
  }

  useEffect(() => {
    if (params.id) {
      refresh(params.id as string)
    }
  }, [])

  return (
    <PageContainer title={detail?.name}>
      <Row gutter={16}>
        <Col span={12}>
          <StorageUseageCard info={detail} />
        </Col>
        <Col span={12}>
          <Card title="Basic Info">
            <ProDescriptions column={1}
                             dataSource={detail}
                             columns={[
                               { title: 'ID', dataIndex: 'id'},
                               { title: 'Name', dataIndex: 'name'},
                               { title: 'Type', dataIndex: 'type'},
                               { title: 'ZFS Pool', dataIndex: ['zfs','name'], render: (dom, record) => (
                                 record?.zfs?.name ? <a onClick={() => history.push(`/zfs/pool/${record.zfs.name}`)}>{record.zfs.name}</a> : '-'
                               )},
                             ]}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{marginTop: 16}}>
        <Col span={24}>
          <Card title="Related Shares">
            <List
              dataSource={detail?.shares || []}
              renderItem={(s) => (
                <List.Item>
                  <List.Item.Meta title={<a onClick={() => history.push(`/sharefolder/${s.name}`)}>{s.name}</a>} description={s.path} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default StorageDetailPage


