import {useEffect, useState} from "react";
import {fetchShareFolderList, updateShareFolder} from "@/services/ant-design-pro/sharefolder";
import type {EditShareFolderFormValues} from "@/components/EditShareFolderForm";
import {message} from "antd";
import {fetchZFSPoolInfo} from "@/services/ant-design-pro/zfs";

const useShareFolderDetail = () => {
  const [shareFolder, setShareFolder] = useState<API.ShareFolder|null>(null);
  const [ZFSPool, setZFSPool] = useState<API.ZPool|undefined>(undefined);
  const refresh = async (name: string) => {
    setShareFolder(null)
    const response = await fetchShareFolderList()
    if (response?.folders) {
      const folder = response.folders.find(it => it.name === name)
      if (folder) {
        setShareFolder(folder)
      }
    }
  }
  const loadZfs = async (name: string) => {
    const response = await fetchZFSPoolInfo(name)
    if (response.success) {
      setZFSPool(response.data)
    }
  }
  useEffect(() => {
    if (!shareFolder) {
      return
    }
    if (shareFolder.storage.type === 'ZFSPool' && shareFolder.storage.zfs?.name){
      loadZfs(shareFolder.storage.zfs?.name)
    }
  },[shareFolder])
  const update = async (name: string,values: EditShareFolderFormValues) => {
    try {
      await updateShareFolder(name,values);
      message.success("更新成功");
    }catch (e) {
      message.error("更新失败");
    }
    await refresh(name);
  }

  return {
    refresh,shareFolder,update,ZFSPool
  }
}
export default useShareFolderDetail
