import {useState} from "react";
import {message} from "antd";
import {appendPartition, fetchDiskInfo, removePartition} from "@/services/ant-design-pro/disk";

const useDiskDetailModel = () => {
  const [disk, setDisk] = useState<API.Disk>();
  const loadDisk = async (name: string) => {
    try {
      const response = await fetchDiskInfo(name);
      if (response.disk) {
        setDisk(response.disk);
      } else {
        message.error(response.reason);
      }
    } catch (e) {
      message.error("获取磁盘信息失败");
    }
  };
  const appendDiskPartition = async (size: string) => {
    if (!disk) {
      return;
    }
    try {
      await appendPartition(`/dev/${disk.name}`, size);
      message.success("添加分区成功");
    } catch (e) {
      message.error("添加分区失败");
    }
    await loadDisk(disk.name);
  }
  const removeDiskPartition = async (idx: number) => {
    if (!disk) {
      return;
    }
    try {
      await removePartition(`/dev/${disk.name}`, idx + 1);
      message.success("删除分区成功");
    } catch (e) {
      message.error("删除分区失败");
    }
    await loadDisk(disk.name);
  }
  return {
    disk,
    loadDisk,
    appendDiskPartition,
    removeDiskPartition
  }

}
export default useDiskDetailModel;
