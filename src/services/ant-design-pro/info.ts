import {request} from "@umijs/max";

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

export async function fetchSystemSensors() {
  return request<API.FetchSensorsResult>('/api/system/sensors', {
    method: 'GET'
  })
}

export async function fetchSystemLoad() {
  return request<API.FetchLoadResult>('/api/system/load', { method: 'GET' })
}
export async function fetchSystemUptime() {
  return request<API.FetchUptimeResult>('/api/system/uptime', { method: 'GET' })
}
export async function fetchFilesystems() {
  return request<API.FetchFilesystemsResult>('/api/system/filesystems', { method: 'GET' })
}
export async function fetchNetIO() {
  return request<API.FetchNetIOResult>('/api/system/netio', { method: 'GET' })
}
