import { request } from "umi"

export async function uploadAppInstallerFile(file: File) {
  const data: FormData = new FormData();
  data.set('file', file);
  return request<API.UploadAppFileResult>("/api/apps/upload", {
    method: "POST",
    data: data
  })
}

export async function installUploadApp(id: number,args: API.AppInstallArg[]) {
  return request<API.BaseResponse>("/api/apps/install", {
    method: "POST",
    params: {
      id,
    },
    data: {
      args
    }
  })
}

export async function fetchAppList(){
  return request<API.AppListResult>("/api/apps")
}

export async function startApp(id: number){
  return request<API.BaseResponse>("/api/app/run", {
    method: "POST",
    params: {
      id,
    }
  })
}

export async function stopApp(id: number){
  return request<API.BaseResponse>("/api/app/stop", {
    method: "POST",
    params: {
      id,
    }
  })
}
