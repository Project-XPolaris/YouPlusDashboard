import {createShareFolder, fetchShareFolderList, updateShareFolder, syncShareAndStorage, importShareFromSMB} from "@/services/ant-design-pro/sharefolder";
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
  const sync = async () => {
    try {
      const res = await syncShareAndStorage();
      if (res) {
        message.success("同步完成");
      }
    } catch (e) {
      message.error("同步失败");
    }
    await refresh();
  }
  const importFromSMB = async () => {
    try {
      const res = await importShareFromSMB();
      if (res) {
        const created = (res as any).createdShares ?? 0;
        const updated = (res as any).updatedShares ?? 0;
        message.success(`导入完成：新增 ${created}，更新 ${updated}`);
        if ((res as any).errors && (res as any).errors.length) {
          message.warning((res as any).errors.join("\n"));
        }
      }
    } catch (e) {
      message.error("导入失败");
    }
    await refresh();
  }
  return {
    create,refresh,shareFolderList,update,sync,importFromSMB
  }
}
export default useShareFolderListModel
