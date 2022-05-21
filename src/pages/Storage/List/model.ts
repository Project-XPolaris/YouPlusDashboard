import {useState} from "react";
import {deleteStorage, fetchStorageList, updateStorage} from "@/services/ant-design-pro/storage";
import {message} from "antd";

const useStorageList = () => {
  const [storageList, setStorageList] = useState<API.Storage[]>([]);
  const refresh = async () => {
    try {
      const response = await fetchStorageList()
      if (response) {
        setStorageList(response.storages)
      }
    } catch (e) {

    }
  }
  const deleteWithId = async (id: string) => {
    try {
      await deleteStorage(id)
      message.success('删除成功')
    }catch (e) {
      message.error('删除失败')
    }
    await refresh()
  }
  const update = async (id: string,options: { name?: string }) => {
    try {
      await updateStorage(id,options)
      message.success('更新成功')
    }catch (e) {
      message.error('更新失败')
    }
    await refresh()
  }
  return {
    storageList,
    refresh,
    deleteWithId,
    update
  }
}
export default useStorageList
