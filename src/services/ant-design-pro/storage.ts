import {request} from "@@/plugin-request/request";

export async function createStorage(source: string, type: string) {
  return request<API.BaseResponse>('/api/storage', {
    method: 'POST',
    data: {
      source,type
    }
  });
}
export async function fetchStorageList() {
  return request<API.GetStorageResult>('/api/storage');
}

export async function deleteStorage(id: string) {
  return request<API.BaseResponse>('/api/storage', {
    method: 'DELETE',
    params: {
      id
    }
  })
}

export async function updateStorage(id: string, options: { name?: string }) {
  return request<API.BaseResponse>(`/api/storage/${id}`, {
    method: 'PATCH',
    data:options
  })
}
