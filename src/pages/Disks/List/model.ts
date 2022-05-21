import {useState} from "react";
import {fetchDiskList} from "@/services/ant-design-pro/disk";

const useDiskListModel = () => {
  const [disks, setDisks] = useState<API.Disk[]>([])
  const refresh = async () => {
    const response = await fetchDiskList()
    if (response.disks) {
      setDisks(response.disks)
    }
  }
  return {
    disks,
    refresh
  }
}

export default useDiskListModel
