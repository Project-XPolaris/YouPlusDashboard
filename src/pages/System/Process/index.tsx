import React, { useMemo } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Divider, Input, InputNumber, Modal, Select, Space, Switch, TabPane, Tabs, Tag, Typography } from 'antd';
import { request } from '@umijs/max';

type ProcessInfo = {
  pid: number;
  name: string;
  username: string;
  cpuPercent: number;
  memPercent: number;
  rss: number;
  vms: number;
  status: string;
  createTime: number;
  cmdline: string;
  nice: number;
  numThreads: number;
};

type ListResponse = {
  success: boolean;
  list: ProcessInfo[];
};

const fetchProcesses = async (params: { search?: string; limit?: number; sample?: number }) => {
  const { search = '', limit = 200, sample = 800 } = params || {};
  const query = new URLSearchParams();
  if (search) query.set('search', search);
  if (limit) query.set('limit', String(limit));
  if (sample) query.set('sample', String(sample));
  const data = await request<ListResponse>(`/api/system/processes?${query.toString()}`);
  return data.list || [];
};

const bytes = (n?: number) => {
  if (!n) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;
  let val = n;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx += 1;
  }
  return `${val.toFixed(1)} ${units[idx]}`;
};

const ProcessPage: React.FC = () => {
  const [keyword, setKeyword] = React.useState('');
  const [autoRefresh, setAutoRefresh] = React.useState<boolean>(true);
  const [interval, setIntervalMs] = React.useState<number>(3000);
  const [lastUpdated, setLastUpdated] = React.useState<number | null>(null);
  const [pageSize, setPageSize] = React.useState<number>(20);
  // filters
  const [filterUsers, setFilterUsers] = React.useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = React.useState<string[]>([]);
  const [minCpu, setMinCpu] = React.useState<number | undefined>(undefined);
  const [minMem, setMinMem] = React.useState<number | undefined>(undefined);
  const [cmdInclude, setCmdInclude] = React.useState<string>('');
  const [cmdExclude, setCmdExclude] = React.useState<string>('');
  const [pidMin, setPidMin] = React.useState<number | undefined>(undefined);
  const [pidMax, setPidMax] = React.useState<number | undefined>(undefined);
  const [advOpen, setAdvOpen] = React.useState<boolean>(false);

  const sampleMs = Math.max(100, interval - 200);

  const { data, run } = useRequest(fetchProcesses, {
    manual: true,
    pollingInterval: autoRefresh ? interval : 0,
    onSuccess: () => setLastUpdated(Date.now()),
  });

  React.useEffect(() => {
    run({ search: keyword, limit: 200, sample: sampleMs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, interval]);

  const columns = useMemo(
    () => [
      { title: 'PID', dataIndex: 'pid', width: 80, sorter: (a: ProcessInfo, b: ProcessInfo) => a.pid - b.pid },
      { title: '进程', dataIndex: 'name', width: 200 },
      { title: '用户', dataIndex: 'username', width: 140 },
      {
        title: 'CPU',
        dataIndex: 'cpuPercent',
        width: 100,
        render: (_: any, r: ProcessInfo) => `${r.cpuPercent.toFixed(1)}%`,
        sorter: (a: ProcessInfo, b: ProcessInfo) => a.cpuPercent - b.cpuPercent,
        defaultSortOrder: 'descend' as const,
      },
      {
        title: '内存',
        dataIndex: 'memPercent',
        width: 100,
        render: (_: any, r: ProcessInfo) => `${r.memPercent.toFixed(1)}%`,
        sorter: (a: ProcessInfo, b: ProcessInfo) => a.memPercent - b.memPercent,
      },
      {
        title: 'RSS',
        dataIndex: 'rss',
        width: 120,
        render: (_: any, r: ProcessInfo) => bytes(r.rss),
        sorter: (a: ProcessInfo, b: ProcessInfo) => a.rss - b.rss,
      },
      {
        title: 'VMS',
        dataIndex: 'vms',
        width: 120,
        render: (_: any, r: ProcessInfo) => bytes(r.vms),
        sorter: (a: ProcessInfo, b: ProcessInfo) => a.vms - b.vms,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 140,
        render: (_: any, r: ProcessInfo) => (
          <Space size={4} wrap>
            {(r.status || '').split(',').filter(Boolean).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </Space>
        ),
      },
      { title: '线程', dataIndex: 'numThreads', width: 100 },
      {
        title: '命令行',
        dataIndex: 'cmdline',
        ellipsis: true,
      },
    ],
    [],
  );

  const usernameOptions = React.useMemo(() => {
    const set = new Set<string>();
    (data || []).forEach((p) => { if (p.username) set.add(p.username); });
    return Array.from(set).sort().map((u) => ({ label: u, value: u }));
  }, [data]);

  const statusOptions = React.useMemo(() => {
    const set = new Set<string>();
    (data || []).forEach((p) => {
      (p.status || '').split(',').filter(Boolean).forEach((s) => set.add(s));
    });
    return Array.from(set).sort().map((s) => ({ label: s, value: s }));
  }, [data]);

  const filteredData = React.useMemo(() => {
    let arr = (data || []).slice();
    if (filterUsers.length > 0) {
      arr = arr.filter((p) => filterUsers.includes(p.username));
    }
    if (filterStatuses.length > 0) {
      arr = arr.filter((p) => {
        const sts = (p.status || '').split(',').filter(Boolean);
        return sts.some((s) => filterStatuses.includes(s));
      });
    }
    if (typeof minCpu === 'number') {
      arr = arr.filter((p) => p.cpuPercent >= (minCpu as number));
    }
    if (typeof minMem === 'number') {
      arr = arr.filter((p) => p.memPercent >= (minMem as number));
    }
    if (cmdInclude) {
      const k = cmdInclude.toLowerCase();
      arr = arr.filter((p) => (p.cmdline || '').toLowerCase().includes(k));
    }
    if (cmdExclude) {
      const k = cmdExclude.toLowerCase();
      arr = arr.filter((p) => !(p.cmdline || '').toLowerCase().includes(k));
    }
    if (typeof pidMin === 'number') {
      arr = arr.filter((p) => p.pid >= (pidMin as number));
    }
    if (typeof pidMax === 'number') {
      arr = arr.filter((p) => p.pid <= (pidMax as number));
    }
    return arr;
  }, [data, filterUsers, filterStatuses, minCpu, minMem, cmdInclude, cmdExclude, pidMin, pidMax]);

  const activeFilterCount = React.useMemo(() => {
    let c = 0;
    if (filterUsers.length) c++;
    if (filterStatuses.length) c++;
    if (typeof minCpu === 'number') c++;
    if (typeof minMem === 'number') c++;
    if (cmdInclude) c++;
    if (cmdExclude) c++;
    if (typeof pidMin === 'number' || typeof pidMax === 'number') c++;
    return c;
  }, [filterUsers, filterStatuses, minCpu, minMem, cmdInclude, cmdExclude, pidMin, pidMax]);

  return (
    <PageContainer
      extra={[
        <Input.Search
          key="search"
          allowClear
          placeholder="按名称/命令行/用户搜索"
          onSearch={(v) => setKeyword(v)}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 280 }}
        />,
        <Space key="refreshCtrl" size={8}>
          <Switch
            checkedChildren="自动"
            unCheckedChildren="手动"
            checked={autoRefresh}
            onChange={setAutoRefresh}
          />
          <Select
            value={interval}
            style={{ width: 120 }}
            onChange={(v) => setIntervalMs(v)}
            options={[
              { label: '1s', value: 1000 },
              { label: '2s', value: 2000 },
              { label: '3s', value: 3000 },
              { label: '5s', value: 5000 },
              { label: '10s', value: 10000 },
            ]}
            getPopupContainer={() => document.body}
          />
          <Button onClick={() => run({ search: keyword, limit: 200, sample: sampleMs })}>刷新</Button>
        </Space>,
        <Divider key="d1" type="vertical" />,
        <Button key="adv" onClick={() => setAdvOpen(true)}>
          高级过滤{activeFilterCount ? `（${activeFilterCount}）` : ''}
        </Button>,
        <Typography.Text key="updated" type="secondary">
          上次刷新：{lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}
        </Typography.Text>,
      ]}
    >
      <Modal
        title="高级过滤"
        open={advOpen}
        onCancel={() => setAdvOpen(false)}
        onOk={() => setAdvOpen(false)}
        width={760}
        footer={[
          <Button key="clear" onClick={() => {
            setFilterUsers([]);
            setFilterStatuses([]);
            setMinCpu(undefined);
            setMinMem(undefined);
            setCmdInclude('');
            setCmdExclude('');
            setPidMin(undefined);
            setPidMax(undefined);
          }}>清空</Button>,
          <Button key="ok" type="primary" onClick={() => setAdvOpen(false)}>应用</Button>,
        ]}
     >
        <Tabs defaultActiveKey="cpu">
          <Tabs.TabPane tab="CPU / 内存" key="cpu">
            <Space size={12} wrap>
              <InputNumber
                addonBefore="CPU≥%"
                min={0}
                max={100}
                value={minCpu}
                onChange={(v) => setMinCpu(typeof v === 'number' ? v : undefined)}
                style={{ width: 180 }}
              />
              <InputNumber
                addonBefore="内存≥%"
                min={0}
                max={100}
                value={minMem}
                onChange={(v) => setMinMem(typeof v === 'number' ? v : undefined)}
                style={{ width: 190 }}
              />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="用户 / 状态" key="user">
            <Space size={12} direction="vertical" style={{ width: '100%' }}>
              <Select
                mode="multiple"
                allowClear
                placeholder="用户"
                style={{ width: '100%' }}
                value={filterUsers}
                onChange={(v) => setFilterUsers(v)}
                options={usernameOptions}
                getPopupContainer={() => document.body}
              />
              <Select
                mode="multiple"
                allowClear
                placeholder="状态"
                style={{ width: '100%' }}
                value={filterStatuses}
                onChange={(v) => setFilterStatuses(v)}
                options={statusOptions}
                getPopupContainer={() => document.body}
              />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="命令 / 进程" key="cmd">
            <Space size={12} direction="vertical" style={{ width: '100%' }}>
              <Input
                allowClear
                placeholder="命令包含"
                value={cmdInclude}
                onChange={(e) => setCmdInclude(e.target.value)}
              />
              <Input
                allowClear
                placeholder="命令排除"
                value={cmdExclude}
                onChange={(e) => setCmdExclude(e.target.value)}
              />
              <Space size={12} wrap>
                <InputNumber
                  placeholder="PID≥"
                  min={0}
                  value={pidMin}
                  onChange={(v) => setPidMin(typeof v === 'number' ? v : undefined)}
                  style={{ width: 180 }}
                />
                <InputNumber
                  placeholder="PID≤"
                  min={0}
                  value={pidMax}
                  onChange={(v) => setPidMax(typeof v === 'number' ? v : undefined)}
                  style={{ width: 180 }}
                />
              </Space>
            </Space>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <ProTable<ProcessInfo>
        rowKey="pid"
        search={false}
        dataSource={filteredData}
        columns={columns as any}
        pagination={{
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          onChange: (_, ps) => setPageSize(ps),
        }}
        options={{ reload: () => run({ search: keyword }) }}
        sticky
        size="small"
      />
    </PageContainer>
  );
};

export default ProcessPage;


