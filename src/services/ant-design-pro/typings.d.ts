// @ts-ignore
/* eslint-disable */

declare namespace API {
  type BaseResponse = {
    success: boolean;
    reason?: string;
    code?: string
  }
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = BaseResponse & {
    token: string;
    uid: string;
  };
  type DiskPart = {
    name: string;
    fs_type: string;
    size: string;
    mountPoint: string;
  }
  type Disk = {
    name: string;
    parts: DiskPart[];
    size: string;

  }
  type DiskListResult = BaseResponse & {
    disks: Disk[];
  }

  type GetCurrentUserResult = BaseResponse & {
    uid: string;
    username: string;
  }
  type Vdev = {
    name: string;
    size: number;
    type: string;
    free: number;
    alloc: number;
    path: string;
    devices: Vdev[];
    l2Cache: Vdev[];
    spares: Vdev[];
  }
  type ZPool = {
    name: string;
    tree: Vdev;
  }
  type GetPoolsResult = BaseResponse & {
    pools: ZPool[];
  }

  type Storage = {
    id: string;
    type: string;
    name: string;
    used: number;
    total: number;
    zfs?: {
      name: string;
    }
  }

  type GetStorageResult = BaseResponse & {
    storages: Storage[];
  }
  type GetAccountListResult = BaseResponse & {
    users: string[]
  }
  type GroupUser = {
    name: string;
    uid: string;
  }
  type Group = {
    name: string;
    gid: string;
    type: string;
    users?: GroupUser[];
  }
  type GetAccountGroupListResult = BaseResponse & {
    groups: Group[];
  }
  type ShareFolderUser = {
    uid: string;
    name: string;
  }
  type ShareFolderGroup = {
    gid: string;
    name: string;
    type: string;
  }
  type ShareFolder = {
    id: string;
    name: string;
    storage: Storage
    validUsers: ShareFolderUser[];
    invalidUsers: ShareFolderUser[];
    readUsers: ShareFolderUser[];
    writeUsers: ShareFolderUser[];
    validGroups: ShareFolderGroup[];
    invalidGroups: ShareFolderGroup[];
    readGroups: ShareFolderGroup[];
    writeGroups: ShareFolderGroup[];
    enable: boolean;
    public: boolean;
    readonly: boolean;
  }
  type GetShareFolderListResult = BaseResponse & {
    folders: ShareFolder[];
  }
  type GetGroupDetailResult = BaseResponse & Group
  type DeviceInfo = {
    appCount: number,
    diskCount: number,
    shareFolderCount: number,
    storageCount: number,
    userCount: number,
    zfsCount: number
  }
  type GetDeviceInfoResult = BaseResponse & DeviceInfo

  type CpuUsage = {
    idle: number;
    user: number;
    system: number;
    iowait: number;
    total: number;
  }
  type MemoryUsage = {
    used: number;
    free: number;
    total: number;
    cache: number;
  }
  type SystemMonitorResult = BaseResponse & {
    monitor: {
      cpu: CpuUsage;
      memory: MemoryUsage;
    }
  }
  type GetPoolInfoResult = BaseResponse & {
    data: ZPool
  }
  type IPv4Config = {
    dhcp: boolean;
    address: string[];
  }

  type IPv6Config = {
    dhcp?: boolean;
    address: string[];
  }

  type Configuration = {
    autonegotiation: string;
    broadcast: string;
    driver: string;
    driverversion: string;
    duplex: string;
    firmware: string;
    ip: string;
    latency: string;
    link: string;
    multicast: string;
    port: string;
    speed: string;
  }

  type  Capabilities = {
    pm: string;
    msi: string;
    pciexpress: string;
    msix: string;
    bus_master: string;
    cap_list: string;
    ethernet: boolean;
    physical: string;
    tp: string;
    mii: string;
    autonegotiation: string;
  }

  type HardwareInfo = {
    id: string;
    class: string;
    claimed: boolean;
    handle: string;
    description: string;
    product: string;
    vendor: string;
    physid: string;
    businfo: string;
    logicalname: string;
    version: string;
    serial: string;
    units: string;
    size: number;
    capacity: number;
    width: number;
    clock: number;
    configuration: Configuration;
    capabilities: Capabilities;
  }

  type  Network = {
    name: string;
    IPv4Address: string[];
    IPv6Address: string[];
    IPv4Config: IPv4Config;
    IPv6Config: IPv6Config;
    hardwareInfo: HardwareInfo;
  }

  type  GetNetworkListResult = BaseResponse & {
    networks: Network[];
  }
  type AppInstallerArg = {
    name: string;
    type: string;
    key: string;
    source: string;
    desc: string;
    require: boolean;
  }
  type  UploadAppFileResult = {
    appName: string;
    args: AppInstallerArg[];
    id: number;
    name: string;
    success: boolean;
    type: string;
  }
  type PathItem = {
    name: string
    type: string
    path: string
  }
  type AppInstallArg = {
    name: string;
    value: string;
    source: string;
  }
  type App = {
    id: number
    name: string;
    status: string;
    autoStart: boolean;
    type: string;
  }
  type AppListResult = BaseResponse & {
    apps: App[];
  }
  type AppInstallTaskOutput = {
    appName: string;
    output: string;
  }
  type TaskExtra = AppInstallTaskOutput
  type Task = {
    id: number
    status: string;
    errorMessage: string;
    type: string;
    updated: string;
    created: string;
    extra: TaskExtra;
  }
  type FetchTaskListResult = BaseResponse & {
    tasks: Task[];
  }
  type Dataset = {
    path: string;
    pool: string;
  }
  type FetchDatasetListResult = BaseResponse & {
    list: Dataset[];
  }
  type FetchDiskInfoResult = BaseResponse & {
    disk: DiskInfo
  }
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
