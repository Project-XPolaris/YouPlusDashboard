import {request} from "@@/plugin-request/request";

export function fetchDeviceInfo() {
  return request<API.GetDeviceInfoResult>('/api/device/info', {
    method: 'GET'
  })
}
export async function devicePowerOff() {
  return request<API.BaseResponse>('/api/os/shutdown', {
    method: 'POST'
  })
}
export async function deviceReboot() {
  return request<API.BaseResponse>('/api/os/reboot', {
    method: 'POST'
  })
}

export async function fetchSystemMonitor() {
  return request<API.SystemMonitorResult>('/api/system/monitor', {
    method: 'GET'
  })
}

export async function fetchNetworkList() {
  return request<API.GetNetworkListResult>('/api/network', {
    method: 'GET'
  })
}

export async function fetchTaskList() {
  return request<API.FetchTaskListResult>('/api/tasks', {
    method: 'GET'
  })
}
