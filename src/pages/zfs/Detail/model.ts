import {useState} from "react";
import {fetchDataSetList, fetchZFSPoolInfo} from "@/services/ant-design-pro/zfs";
import {createStorage} from "@/services/ant-design-pro/storage";
import {message} from "antd";

const usePoolDetailModel = () => {
  const [pool,setPool] = useState<API.ZPool | undefined>();
  const [datasetList, setDatasetList] = useState<API.Dataset[]>([]);
  const [datasetListLoading, setDatasetListLoading] = useState(false);
  const refresh = async (name: string) => {
    try {
      const response = await fetchZFSPoolInfo(name);
      if (response.data) {
        setPool(response.data);
      }
    } catch (e) {
      message.error("获取池信息失败");
    }
  }
  const refreshDataset = async (name: string) => {
    setDatasetListLoading(true);
    try {
      const response = await fetchDataSetList({pool: name});
      if (response.list) {
        setDatasetList(response.list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDatasetListLoading(false);
    }
  }
  const setAsStorage = async (path: string) => {
    if (!pool) {
      return;
    }
    try {
      await createStorage(path, "ZFSPool")
      message.success("设置成功")
    }catch (e) {
      message.error("设置失败")
    }
    await refreshDataset(pool.name)
  }
  return {
    datasetList,datasetListLoading,refreshDataset,setAsStorage,refresh
  }
}
export default usePoolDetailModel
