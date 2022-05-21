import {createAccountGroup, fetchAccountGroupList, removeAccountGroup} from "@/services/ant-design-pro/account";
import {message} from "antd";
import {useState} from "react";

const useAccountGroupsModel = () => {
  const [accountGroups, setAccountGroups] = useState<API.Group[]>([]);
  const refresh = async () => {
    const response = await fetchAccountGroupList();
    if (response ) {
      setAccountGroups(response.groups);
    }
  }
  const add = async (name: string) => {
    try {
      await createAccountGroup(name);
      message.success("添加成功");
    }catch (e) {
      message.error("添加失败");
    }
    await refresh()
  }
  const remove = async (name: string) => {
    try {
      await removeAccountGroup(name);
      message.success("删除成功");
    }catch (e) {
      message.error("删除失败");
    }
    refresh()
  }
  return {
    add,refresh,accountGroups,remove
  }
}
export default useAccountGroupsModel
