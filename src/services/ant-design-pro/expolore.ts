import {request} from "@@/plugin-request/request";

export async function readDir(target: string){
  return request<API.PathItem[]>("/api/path/readdir", {
    method: "GET",
    params: {
      target
    }
  })
}
