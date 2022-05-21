import {createShareFolder, fetchShareFolderList, updateShareFolder} from "@/services/ant-design-pro/sharefolder";
import {message} from "antd";
import {useState} from "react";

const useShareFolderListModel = () => {
  const [shareFolderList, setShareFolderList] = useState<API.ShareFolder[]>([]);
  const refresh  = async () => {
    const response = await fetchShareFolderList()
    if (response){
      setShareFolderList(response.folders)
    }
  }
  const create = async ({name,storage}: {name: string,storage: string}) => {
    try {
      await createShareFolder({name,storageId: storage});
      message.success("创建成功");
    }catch (e) {
      message.error("创建失败");
    }
    await refresh()
  }
  const update = async (name: string,option: {public?: boolean,enable?: boolean}) => {
    try {
      await updateShareFolder(name,option);
      message.success("更新成功");
    } catch (e) {
      message.error("更新失败");
    }
    await refresh()
  }
  return {
    create,refresh,shareFolderList,update
  }
}
export default useShareFolderListModel
