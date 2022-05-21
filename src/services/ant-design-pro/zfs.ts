import {request} from "@@/plugin-request/request";

export async function createSimpleZFSPool (name: string,disks: string[]){
  return request<API.BaseResponse>('/api/zpool', {
    method: 'POST',
    data: {
      name,
      disks
    }
  });
}

export async function fetchZFSPoolList () {
  return request<API.GetPoolsResult>('/api/zpool',{
    method: 'GET'
  });
}

export async function removeZFSPool (name: string) {
  return request<API.BaseResponse>('/api/zpool', {
    method: 'DELETE',
    params: {
      name
    }
  })
}
export async function fetchZFSPoolInfo (name: string) {
  return request<API.GetPoolInfoResult>(`/api/zpool/${name}/info`, {
    method: 'GET',
  })
}

export async function createZFSPool (name: string,conf: any) {
  return request<API.BaseResponse>('/api/zpool/conf', {
    method: 'POST',
    data: {
      name,conf
    }
  })
}
export async function fetchDataSetList (filter: {pool: string}) {
  return request<API.FetchDatasetListResult>(`/api/zpool/dataset`, {
    method: 'GET',
    params: filter
  })
}
