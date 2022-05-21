import {createAccount, fetchAccountList} from "@/services/ant-design-pro/account";
import {message} from "antd";
import {useState} from "react";

const useAccountListModel = () => {
  const [accountList, setAccountList] = useState<string[]>([]);
  const refresh = async () => {
    const response = await fetchAccountList();
    if (response) {
      setAccountList(response.users);
    }
  }
  const create = async (username: string,password: string) => {
    try {
      await createAccount(username,password);
      message.success('创建成功');
    }catch (e) {
        message.error("创建失败");
    }
    await refresh();

  };

  return {
    create,refresh,accountList
  }
}
export default useAccountListModel;
