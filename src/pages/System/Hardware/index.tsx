import React from 'react';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Descriptions, Button, Tabs } from 'antd';
import { request } from '@umijs/max';
import { useRequest } from 'ahooks';

type HardwareResponse = {
  success: boolean;
  hardware: any;
};

const fetchHardware = async () => {
  const res = await request<HardwareResponse>('/api/system/hardware', { method: 'GET' });
  return res.hardware || {};
};

const JsonView: React.FC<{ data: any }> = ({ data }) => (
  <pre style={{ margin: 0, padding: 12, background: '#0b1b2b', color: '#a6e22e', borderRadius: 6, overflow: 'auto' }}>
    {JSON.stringify(data, null, 2)}
  </pre>
);

const Field: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <Descriptions column={1} size="small" bordered>
    <Descriptions.Item label={label}>{String(value ?? '')}</Descriptions.Item>
  </Descriptions>
);

function getCaseInsensitive(obj: any, key: string) {
  if (!obj || typeof obj !== 'object') return undefined;
  const k = Object.keys(obj).find((x) => x.toLowerCase() === key.toLowerCase());
  return k ? obj[k] : undefined;
}

function getByPathCI(obj: any, path: string[]) {
  let cur = obj;
  for (const seg of path) {
    if (cur == null) return undefined;
    cur = getCaseInsensitive(cur, seg);
  }
  return cur;
}

function pick(obj: any, candidates: string[][], joiner?: (v: any) => string) {
  for (const p of candidates) {
    const v = getByPathCI(obj, p);
    if (v !== undefined && v !== null && String(v).length > 0) {
      return joiner ? joiner(v) : v;
    }
  }
  return '';
}

const HardwarePage: React.FC = () => {
  const { data, run, loading } = useRequest(fetchHardware, { pollingInterval: 0 });

  const hw = data || {};
  const storage = getByPathCI(hw, ['Storage']) || getByPathCI(hw, ['storage']) || {};
  const network = getByPathCI(hw, ['Network']) || getByPathCI(hw, ['network']) || {};

  const hostname = pick(hw, [
    ['Node', 'Hostname'],
    ['node', 'hostname'],
    ['OS', 'Hostname'],
    ['os', 'hostname'],
  ]);
  const productName = pick(hw, [
    ['Product', 'Name'],
    ['product', 'name'],
    ['Board', 'Product'],
    ['board', 'product'],
  ]);
  const serial = pick(hw, [
    ['Product', 'Serial'],
    ['product', 'serial'],
    ['Board', 'Serial'],
    ['board', 'serial'],
  ]);
  const boardProd = pick(hw, [
    ['Board', 'Product'],
    ['board', 'product'],
  ]);
  const chassisType = pick(hw, [
    ['Chassis', 'Type'],
    ['chassis', 'type'],
  ]);
  const biosVendor = pick(hw, [
    ['BIOS', 'Vendor'],
    ['bios', 'vendor'],
  ]);
  const biosVersion = pick(hw, [
    ['BIOS', 'Version'],
    ['bios', 'version'],
  ]);
  const osName = pick(hw, [
    ['OS', 'Name'],
    ['os', 'name'],
    ['OS', 'OS'],
    ['os', 'os'],
  ]);
  const osRelease = pick(hw, [
    ['OS', 'Release'],
    ['os', 'release'],
    ['OS', 'Version'],
    ['os', 'version'],
  ]);
  const kernel = pick(hw, [
    ['Kernel', 'Release'],
    ['kernel', 'release'],
    ['Kernel', 'Version'],
    ['kernel', 'version'],
  ]);
  const arch = pick(hw, [
    ['OS', 'Architecture'],
    ['os', 'architecture'],
    ['Kernel', 'Architecture'],
    ['kernel', 'architecture'],
    ['OS', 'Arch'],
    ['os', 'arch'],
  ]);

  const cpuModel = pick(hw, [
    ['CPU', 'ModelName'],
    ['cpu', 'modelname'],
    ['CPU', 'Model'],
    ['cpu', 'model'],
    ['CPU', 'Brand'],
    ['cpu', 'brand'],
  ]);
  const cpuCores = pick(hw, [
    ['CPU', 'Cores'],
    ['cpu', 'cores'],
    ['CPU', 'PhysicalCores'],
    ['cpu', 'physicalcores'],
  ]);
  const cpuThreads = pick(hw, [
    ['CPU', 'Threads'],
    ['cpu', 'threads'],
    ['CPU', 'LogicalCores'],
    ['cpu', 'logicalcores'],
  ]);
  const cpuClock = pick(hw, [
    ['CPU', 'Clock'],
    ['cpu', 'clock'],
    ['CPU', 'Speed'],
    ['cpu', 'speed'],
    ['CPU', 'Mhz'],
    ['cpu', 'mhz'],
  ]);

  const memTotal = pick(hw, [
    ['Memory', 'Total'],
    ['memory', 'total'],
    ['Memory', 'Size'],
    ['memory', 'size'],
  ]);
  const memType = pick(hw, [
    ['Memory', 'Type'],
    ['memory', 'type'],
  ]);
  const memSlots = pick(hw, [
    ['Memory', 'Slots'],
    ['memory', 'slots'],
    ['Memory', 'Channels'],
    ['memory', 'channels'],
  ]);

  return (
    <PageContainer
      extra={[
        <Button key="refresh" onClick={() => run()} loading={loading}>刷新</Button>,
      ]}
    >
      <ProCard split="horizontal" gutter={8}>
        <ProCard title="概要">
          <Descriptions bordered size="small" column={3}>
            <Descriptions.Item label="主机名">{hostname}</Descriptions.Item>
            <Descriptions.Item label="型号">{productName}</Descriptions.Item>
            <Descriptions.Item label="序列号">{serial}</Descriptions.Item>
            <Descriptions.Item label="主板">{boardProd}</Descriptions.Item>
            <Descriptions.Item label="机箱">{chassisType}</Descriptions.Item>
            <Descriptions.Item label="BIOS">{[biosVendor, biosVersion].filter(Boolean).join(' ')}</Descriptions.Item>
            <Descriptions.Item label="OS">{[osName, osRelease].filter(Boolean).join(' ')}</Descriptions.Item>
            <Descriptions.Item label="内核">{kernel}</Descriptions.Item>
            <Descriptions.Item label="架构">{arch}</Descriptions.Item>
          </Descriptions>
        </ProCard>
        <ProCard title="CPU / 内存" gutter={8} split="vertical">
          <ProCard colSpan="50%">
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="CPU 型号">{cpuModel}</Descriptions.Item>
              <Descriptions.Item label="物理核数">{cpuCores}</Descriptions.Item>
              <Descriptions.Item label="逻辑线程">{cpuThreads}</Descriptions.Item>
              <Descriptions.Item label="频率">{cpuClock ? `${cpuClock} MHz` : ''}</Descriptions.Item>
            </Descriptions>
          </ProCard>
          <ProCard colSpan="50%">
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="内存总量">{memTotal ? `${memTotal} MB` : ''}</Descriptions.Item>
              <Descriptions.Item label="内存类型">{memType}</Descriptions.Item>
              <Descriptions.Item label="通道/插槽">{memSlots}</Descriptions.Item>
            </Descriptions>
          </ProCard>
        </ProCard>
        <ProCard title="存储 / 网络">
          <Tabs>
            <Tabs.TabPane tab="存储" key="storage">
              <StorageTable storage={storage} root={hw} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="网络" key="network">
              <NetworkTable network={network} root={hw} />
            </Tabs.TabPane>
          </Tabs>
        </ProCard>
        <ProCard title="原始 JSON">
          <JsonView data={hw} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default HardwarePage;

// ===== 工具与表格渲染 =====
function bytes(n?: number) {
  if (!n || n <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let val = n;
  let i = 0;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i += 1;
  }
  return `${val.toFixed(1)} ${units[i]}`;
}

const StorageTable: React.FC<{ storage: any; root?: any }> = ({ storage, root }) => {
  const entries: any[] = React.useMemo(() => {
    let arr = Array.isArray(storage)
      ? storage
      : (
      getByPathCI(storage, ['BlockDevices']) ||
      getByPathCI(storage, ['blockdevices']) ||
      getByPathCI(storage, ['Devices']) ||
      getByPathCI(storage, ['devices']) ||
      getByPathCI(storage, ['Disks']) ||
      getByPathCI(storage, ['disks']) ||
      []
    ) as any[];
    if (!Array.isArray(arr) || arr.length === 0) {
      // 兼容部分实现直接把 blockdevices 挂在根上
      arr = (
        getByPathCI(root, ['Storage', 'BlockDevices']) ||
        getByPathCI(root, ['storage', 'blockdevices']) ||
        getByPathCI(root, ['BlockDevices']) ||
        getByPathCI(root, ['blockdevices']) ||
        []
      ) as any[];
    }
    const asArray = Array.isArray(arr) ? arr : [];
    const mapEntry = (d: any): any => {
      const name = pick(d, [['Name'], ['name'], ['KName'], ['kname']]);
      const model = pick(d, [['Model'], ['model']]);
      const vendor = pick(d, [['Vendor'], ['vendor']]);
      const driver = pick(d, [['Driver'], ['driver']]);
      const size = pick(d, [['Size'], ['size'], ['Bytes'], ['bytes']]);
      const dtype = pick(d, [['Type'], ['type']]);
      const serial = pick(d, [['Serial'], ['serial']]);
      const path = pick(d, [['Path'], ['path'], ['DevPath'], ['devpath']]);
      const children = (getByPathCI(d, ['Children']) || getByPathCI(d, ['children']) || getByPathCI(d, ['Partitions']) || getByPathCI(d, ['partitions']) || []) as any[];
      const childRows = (Array.isArray(children) ? children : []).map((p: any) => ({
        key: `${name}-${pick(p, [['Name'], ['name']])}`,
        name: pick(p, [['Name'], ['name']]),
        model: pick(p, [['Label'], ['label']]),
        vendor: '',
        size: pick(p, [['Size'], ['size'], ['Bytes'], ['bytes']]),
        type: pick(p, [['Type'], ['type'], ['FsType'], ['fstype']]),
        serial: pick(p, [['UUID'], ['uuid']]),
        path: pick(p, [['Path'], ['path'], ['MountPoint'], ['mountpoint']]),
      }));
      return {
        key: String(name || path || model || serial || Math.random()),
        name,
        model,
        vendor: vendor || driver,
        size,
        type: dtype,
        serial,
        path,
        children: childRows.length ? childRows : undefined,
      };
    };
    return asArray.map(mapEntry);
  }, [storage]);

  const columns: any[] = [
    { title: '设备', dataIndex: 'name', width: 140, ellipsis: true },
    { title: '型号', dataIndex: 'model', width: 200, ellipsis: true },
    { title: '厂商/驱动', dataIndex: 'vendor', width: 160, ellipsis: true },
    { title: '容量', dataIndex: 'size', width: 120, render: (v: any) => (typeof v === 'number' ? `${v} GB` : v) },
    { title: '类型', dataIndex: 'type', width: 120, ellipsis: true },
    { title: '序列号/UUID', dataIndex: 'serial', width: 220, ellipsis: true },
    { title: '路径/挂载', dataIndex: 'path', width: 260, ellipsis: true },
  ];
  return (
    <ProTable
      rowKey="key"
      search={false}
      dataSource={entries}
      columns={columns}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 'max-content' }}
      expandable={{ defaultExpandAllRows: false }}
      size="small"
    />
  );
};

const NetworkTable: React.FC<{ network: any; root?: any }> = ({ network, root }) => {
  const rows: any[] = React.useMemo(() => {
    let arr = Array.isArray(network)
      ? network
      : (
      getByPathCI(network, ['Interfaces']) ||
      getByPathCI(network, ['interfaces']) ||
      getByPathCI(network, ['Cards']) ||
      getByPathCI(network, ['cards']) ||
      getByPathCI(network, ['Adapters']) ||
      getByPathCI(network, ['adapters']) ||
      getByPathCI(network, ['List']) ||
      getByPathCI(network, ['list']) ||
      []
    ) as any[];
    if (!Array.isArray(arr) || arr.length === 0) {
      arr = (
        getByPathCI(root, ['Network', 'Interfaces']) ||
        getByPathCI(root, ['network', 'interfaces']) ||
        []
      ) as any[];
    }
    const asArray = Array.isArray(arr) ? arr : [];
    const addrs = (o: any, keys: string[]) => {
      const v = keys.map((k) => getByPathCI(o, [k])).find((x) => Array.isArray(x));
      return (Array.isArray(v) ? v : []).map((x: any) => String(x)).filter(Boolean);
    };
    return asArray.map((n: any, idx: number) => {
      const name = pick(n, [['Name'], ['name'], ['IfName'], ['ifname']]);
      const mac = pick(n, [['MAC'], ['mac'], ['HardwareAddr'], ['hardwareaddr'], ['MacAddress'], ['macaddress']]);
      const ipv4 = addrs(n, ['IPv4', 'ipv4', 'IPv4Address', 'ipv4address', 'Address4', 'address4']);
      const ipv6 = addrs(n, ['IPv6', 'ipv6', 'IPv6Address', 'ipv6address', 'Address6', 'address6']);
      const speed = pick(n, [['Speed'], ['speed']]);
      const driver = pick(n, [['Driver'], ['driver']]);
      const state = pick(n, [['State'], ['state'], ['OperState'], ['operstate'], ['Link'], ['link']]);
      return {
        key: String(name || idx),
        name,
        mac,
        ipv4: ipv4.join(', '),
        ipv6: ipv6.join(', '),
        speed,
        driver,
        state,
      };
    });
  }, [network]);

  const columns: any[] = [
    { title: '接口', dataIndex: 'name', width: 140, ellipsis: true },
    { title: 'MAC', dataIndex: 'mac', width: 200, ellipsis: true },
    { title: 'IPv4', dataIndex: 'ipv4', width: 260, ellipsis: true },
    { title: 'IPv6', dataIndex: 'ipv6', width: 360, ellipsis: true },
    { title: '速率', dataIndex: 'speed', width: 120 },
    { title: '驱动', dataIndex: 'driver', width: 160, ellipsis: true },
    { title: '状态', dataIndex: 'state', width: 120 },
  ];
  return (
    <ProTable
      rowKey="key"
      search={false}
      dataSource={rows}
      columns={columns}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 'max-content' }}
      size="small"
    />
  );
};


