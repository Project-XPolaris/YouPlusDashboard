import {PageContainer} from "@ant-design/pro-layout";
import useNetworkListModel from "@/pages/Network/List/model";
import {useEffect} from "react";

const NetworkListPage = () => {
  const model = useNetworkListModel()
  useEffect(() => {
    model.refresh()
  },[])
  return (
    <PageContainer>

    </PageContainer>
  )
}
export default NetworkListPage
