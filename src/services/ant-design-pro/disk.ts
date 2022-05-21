import {request} from "@@/plugin-request/request";

export async function fetchDiskList() {
  return request<API.DiskListResult>('/api/disks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetchDiskInfo(device: string) {
  return request<API.FetchDiskInfoResult>('/api/disks/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      device,
    },
  });
}

export async function appendPartition(device: string,size: string) {
  return request<API.BaseResponse>('/api/disks/addpartition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      device,
    },
    data: {
      size,
    },
  });
}
export async function removePartition(device: string,id: number) {
  return request<API.BaseResponse>('/api/disks/removepartition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      device,
    },
    data: {
      id,
    },
  });
}
