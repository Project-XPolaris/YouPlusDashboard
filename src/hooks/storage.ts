import {useState} from "react";
import {fetchStorageList} from "@/services/ant-design-pro/storage";

const useStorageList = () => {
  const [storageList, setStorageList] = useState<API.Storage[]>([]);
  const refresh = async () => {
    const response = await fetchStorageList()
    if (response) {
      setStorageList(response.storages);
    }

  }
  return{
    storageList,refresh
  }
}
export default useStorageList;
