import {request} from "@umijs/max";

export async function readDir(target: string){
  return request<API.PathItem[]>("/api/path/readdir", {
    method: "GET",
    params: {
      target
    }
  })
}
