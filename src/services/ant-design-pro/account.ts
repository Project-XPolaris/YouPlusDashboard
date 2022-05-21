import {request} from "@@/plugin-request/request";

export async function createAccount(username: string, password: string): Promise<API.BaseResponse> {
  return request<API.BaseResponse>('/api/users', {
    method: 'POST',
    data:{
      username,password
    }
  });
}

export async function fetchAccountList(): Promise<API.GetAccountListResult> {
  return request<API.GetAccountListResult>('/api/users', {
    method: 'GET',
  });
}

export async function createAccountGroup(name: string): Promise<API.BaseResponse> {
  return request<API.BaseResponse>('/api/groups', {
    method: 'POST',
    data: {
      name
    }
  })
}
export async function fetchAccountGroupList(): Promise<API.GetAccountGroupListResult> {
  return request<API.GetAccountGroupListResult>('/api/groups', {
    method: 'GET',
  })
}
export async function removeAccountGroup(name: string): Promise<API.BaseResponse> {
  return request<API.BaseResponse>('/api/groups', {
    method: 'DELETE',
    params: {
      name
    }
  })
}
export async function fetchGroupDetail(name: string): Promise<API.GetGroupDetailResult> {
  return request<API.GetGroupDetailResult>(`/api/group/${name}`, {
    method: 'GET',
    params: {
      name
    }
  })
}
export async function addAccountToGroup(name: string, users: string[]): Promise<API.BaseResponse> {
  return request<API.BaseResponse>(`/api/group/${name}/users`, {
    method: 'POST',
    data: {
      users,
    }
  })
}

export async function removeAccountFromGroup(name: string, users: string[]): Promise<API.BaseResponse> {
  return request<API.BaseResponse>(`/api/group/${name}/users`, {
    method: 'DELETE',
    data: {
      users,
    }
  })
}

