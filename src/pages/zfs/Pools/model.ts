import {createSimpleZFSPool, createZFSPool, fetchZFSPoolList, removeZFSPool} from "@/services/ant-design-pro/zfs";
import {message} from "antd";
import {useState} from "react";
import type {VdevTreeNode} from "@/hooks/vdev";

export type ZFSPoolItem = {
  name: string;
  size: number;
  free: number;
  alloc: number;
  tree: API.Vdev
}
const useZFSPoolsModel = () => {
  const [zfsPools, setZfsPools] = useState<API.ZPool[]>([]);
  const refresh = async () => {
    try {
      const response = await fetchZFSPoolList();
      if (response){
        setZfsPools(response.pools);
      }
    } catch (e) {

    }
  }
  const createPool = async (name: string, disks: string[]) => {
    const poolDisk = disks.map(disk => `/dev/${disk}`)
    try {
      await createSimpleZFSPool(name, poolDisk)
      message.success("创建成功")
    } catch (e) {
      message.error("创建失败")
    }
    await refresh();
  }
  const deletePool = async (name: string) => {
    try {
      await removeZFSPool(name);
      message.success("删除成功")
    } catch (e) {
      message.error("删除失败")
    }
    await refresh();
  }
  const getZPools = (): ZFSPoolItem[] => {
    return zfsPools.map(pool => ({
      name:pool.name,
      size:pool.tree.size,
      free:pool.tree.free,
      alloc:pool.tree.alloc,
      tree:pool.tree
    }))
  }

  const createWithConfig = async ({name,conf }: {name: string,conf: VdevTreeNode }) => {
    try {
      await createZFSPool(name, conf);
      message.success("创建成功")
    }catch (e) {
      message.error("创建失败")
    }
    await refresh();
  }
  return {
    createPool,zfsPools,refresh,getZPools,deletePool,createWithConfig
  }
}
export default useZFSPoolsModel
