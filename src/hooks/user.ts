import {useState} from "react";
import {fetchAccountList} from "@/services/ant-design-pro/account";

const useAccountList = () => {
  const [accounts, setAccounts] = useState<string[]>([])
  const refresh = async () => {
    const response = await fetchAccountList()
    if (response?.users) {
      setAccounts(response.users)
    }
  }
  return {
    accounts,refresh
  }
}
export default useAccountList
