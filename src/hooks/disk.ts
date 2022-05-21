import {useState} from "react";
import {fetchDiskList} from "@/services/ant-design-pro/disk";

const useDiskList = () => {
  const [diskList, setDiskList] = useState<API.Disk[]>([]);
  const refresh = async () => {
    const response = await fetchDiskList()
    if (response) {
      setDiskList(response.disks)
    }
  }
  return {diskList, refresh}
}
export default useDiskList;
