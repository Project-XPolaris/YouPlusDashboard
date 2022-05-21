import {useState} from "react";
import {fetchAppList, startApp, stopApp} from "@/services/ant-design-pro/app";
import {message} from "antd";

const useAppListModel = () => {
  const [apps, setApps] = useState<API.App[]>([]);

  const refresh = async () => {
    try {
      const response = await fetchAppList()
      setApps(response.apps)
    } catch (e) {
      message.error("获取应用列表失败，请重试！");
    }
  }
  const start = async (id: number) => {
    try {
      await startApp(id);
      await refresh()
    }catch (e) {
      message.error("启动失败");
    }
  }
  const stop = async (id: number) => {
    try {
      await stopApp(id);
      await refresh()
    }catch (e) {
      message.error("停止失败");
    }
  }
  return {
    apps,refresh,start,stop
  }

}

export default useAppListModel
