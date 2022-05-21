import {request} from "@@/plugin-request/request";

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
}) {

  return request<API.BaseResponse>('/api/share/update', {
    method: 'POST',
    data: {
      name,
      ...option
    }
  })
}
