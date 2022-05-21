import {PageContainer} from "@ant-design/pro-layout";
import {Col, Row} from "antd";
import type {IRouteComponentProps} from "@umijs/renderer-react";
import {useEffect} from "react";
import useShareFolderDetail from "@/pages/ShareFolder/Detail/model";
import EditShareFolderForm from "@/components/EditShareFolderForm";
import StorageUseageCard from "@/components/StorageUseageCard";
import ZfsUsageCard from "@/components/ZfsUsageCard";
import ShareFolderUserListCard from "@/components/ShareFolderUserListCard";
import styles from "./index.less";
type ShareFolderDetailProps = IRouteComponentProps<{ name?: string },{}> &{

}
const ShareFolderDetailPage = ({match}: ShareFolderDetailProps) => {
  const model = useShareFolderDetail()
  useEffect(() => {
    if (match.params.name) {
      model.refresh(match.params.name)
    }
  },[])
  return (
    <PageContainer
      title={model.shareFolder?.name}
      extra={[
        <EditShareFolderForm
          key="edit"
          shareFolder={model.shareFolder}
          onUpdate={async (values) => {
            if (model.shareFolder?.name){
              await model.update(model.shareFolder?.name,values)
            }
          }}
        />
      ]}
     >
      <Row gutter={16} className={styles.row}>
        <Col span={12}>
          <StorageUseageCard info={model.shareFolder?.storage} />
        </Col>
        <Col span={12}>
          <ZfsUsageCard info={model.ZFSPool} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <ShareFolderUserListCard shareFolder={model.shareFolder} />
        </Col>
      </Row>
    </PageContainer>
  )
}
export default ShareFolderDetailPage
