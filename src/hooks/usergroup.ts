import {useState} from "react";
import {fetchAccountGroupList} from "@/services/ant-design-pro/account";

const useUserGroupList = () => {
  const [userGroupList, setUserGroupList] = useState<API.Group[]>([]);
  const refresh = async () => {
    const response = await fetchAccountGroupList()
    if (response?.groups) {
      setUserGroupList(response.groups);
    }
  }
  return {
    userGroupList,
    refresh
  }
}
export default useUserGroupList;
