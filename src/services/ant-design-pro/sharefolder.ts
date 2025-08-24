import {request} from "@umijs/max";

export async function createShareFolder({name, storageId}: { name: string, storageId: string }) {
  return request<API.BaseResponse>('/api/share', {
    method: 'POST',
    data: {
      name, storageId, public: false
    }
  })
}
export async function fetchShareFolderList() {
  return request<API.GetShareFolderListResult>('/api/share', {
    method: 'GET'
  })
}

export async function updateShareFolder(name: string,option: {
  enable?: boolean;
  public?: boolean;
  readonly?: boolean;
  readUsers?: string[];
  writeUsers?: string[];
  validUsers?: string[];
  invalidUsers?: string[];
  readGroups?: string[];
  writeGroups?: string[];
  validGroups?: string[];
  invalidGroups?: string[];
  storageId?: string;
  newName?: string;
}) {

  return request<API.BaseResponse>('/api/share/update', {
    method: 'POST',
    data: {
      name,
      ...option
    }
  })
}

export async function syncShareAndStorage() {
  return request<API.BaseResponse & {
    createdStorages: number;
    updatedStorages: number;
    createdShares: number;
    updatedShares: number;
    errors?: string[];
  }>("/api/share/sync", {
    method: 'POST'
  })
}

export async function importShareFromSMB() {
  return request<API.BaseResponse & {
    createdShares: number;
    updatedShares: number;
    errors?: string[];
  }>("/api/share/import", {
    method: 'POST'
  })
}

export async function fetchSMBSections() {
  return request<{sections: {name: string, fields: Record<string,string>, isShareFolder: boolean, shareFolderId?: number}[]}>("/api/smb/sections", {
    method: 'GET'
  })
}

export async function fetchSMBRaw() {
  return request<{raw: string}>("/api/smb/raw", {
    method: 'GET'
  })
}

export async function updateSMBRaw(raw: string) {
  return request<API.BaseResponse>("/api/smb/raw", {
    method: 'POST',
    data: { raw }
  })
}

export async function fetchSMBStatus() {
  return request<API.FetchSMBStatusResult>("/api/smb/status", {
    method: 'GET'
  })
}

export async function restartSMB() {
  return request<API.BaseResponse>("/api/smb/restart", {
    method: 'POST'
  })
}

export async function fetchSMBInfo() {
  return request<{success: boolean; name: string; status: string}>("/api/smb/info", {
    method: 'GET'
  })
}
