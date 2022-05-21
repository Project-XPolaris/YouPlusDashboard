import {useState} from "react";
import {addAccountToGroup, fetchGroupDetail, removeAccountFromGroup} from "@/services/ant-design-pro/account";
import {message} from "antd";

const useGroupDetail = () => {
  const [group, setGroup] = useState<API.Group | null>(null);
  const refresh = async (name: string) => {
    const response = await fetchGroupDetail(name)
    if (response) {
      setGroup(response)
    }
  }
  const addUser = async (name: string, users: string[]) => {
    try {
      await addAccountToGroup(name, users)
      message.success('添加成功')
    }catch (e) {
      message.error('添加失败')
    }
    await refresh(name)
  }
  const removeUser = async (name: string, users: string[]) => {
    try {
      await removeAccountFromGroup(name, users)
      message.success('删除成功')

    } catch (e) {
      message.error('删除失败')
    }
    await refresh(name)
  }
  return {
    group,
    refresh,
    addUser,
    removeUser
  }
}
export default useGroupDetail
