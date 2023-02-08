import {useState} from "react";
import {fetchDataSetList, fetchZFSPoolInfo} from "@/services/ant-design-pro/zfs";
import {createStorage} from "@/services/ant-design-pro/storage";
import {message} from "antd";

const usePoolDetailModel = () => {
  const [pool, setPool] = useState<API.ZPool | undefined>();
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
    } catch (e) {
      message.error("设置失败")
    }
    await refreshDataset(pool.name)
  }
  const getDiskList = (): string[] => {
    if (!pool) {
      return [];
    }
    const queue = [pool.tree];
    const diskList: string[] = [];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node?.devices) {
        queue.push(...node.devices);
      }
      if (node?.spares) {
        queue.push(...node.spares);
      }
      if (node?.l2Cache) {
        queue.push(...node.l2Cache);
      }
      if (node?.type === "disk") {
        diskList.push(node.name);
      }
    }
    return diskList;
  }
  return {
    datasetList, datasetListLoading, refreshDataset, setAsStorage, refresh, pool, getDiskList
  }
}
export default usePoolDetailModel
