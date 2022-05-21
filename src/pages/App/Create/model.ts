import {useState} from "react";
import {installUploadApp, uploadAppInstallerFile} from "@/services/ant-design-pro/app";
import {message} from "antd";

const useCreateAppModel = () => {
  const [appInfo,setAppInfo] = useState<API.UploadAppFileResult>()
  const upload = async (file: File) => {
    try {
      const response = await uploadAppInstallerFile(file)
      setAppInfo(response)
      message.success('上传成功')
      return true
    }catch (e) {
      message.error('上传失败')
      return false
    }
  }
  const install = async (values: any) => {
    if (!appInfo) {
      message.error('请先上传文件')
      return
    }
    const installArgs: API.AppInstallArg[] = []
    for (const arg of appInfo.args) {
      if (values[arg.key]) {
        installArgs.push({
          name: arg.key,
          value: values[arg.key],
          source: arg.source,
        })
      }
    }
    try {
      await installUploadApp(appInfo.id, installArgs)
      message.success('添加安装任务成功')
      return true
    }catch (e) {
      message.error('添加安装任务失败')
      return false
    }
  }
  return {
    appInfo,
    upload,
    install
  }
}
export default useCreateAppModel
