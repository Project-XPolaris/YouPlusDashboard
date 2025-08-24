import {useEffect, useMemo, useState} from 'react';
import {fetchSMBSections} from '@/services/ant-design-pro/sharefolder';
import {Badge, Card, Checkbox, Descriptions, Input, Select, Space, Table, Tag, Tooltip} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PageContainer} from '@ant-design/pro-components';

type SectionRecord = {
  key: string;
  name: string;
  isShareFolder: boolean;
  shareFolderId?: number;
  fields: Record<string,string>;
  path?: string;
  publicFlag?: boolean;
  availableFlag?: boolean;
  browseableFlag?: boolean;
  readOnlyFlag?: boolean;
}

export default () => {
  const [data, setData] = useState<SectionRecord[]>([]);
  const [nameQuery, setNameQuery] = useState('');
  const [pathQuery, setPathQuery] = useState('');
  const [shareFolderFilter, setShareFolderFilter] = useState<'all'|'yes'|'no'>('all');
  const [onlyPublic, setOnlyPublic] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyBrowseable, setOnlyBrowseable] = useState(false);
  const [onlyReadOnly, setOnlyReadOnly] = useState(false);

  const columns: ColumnsType<SectionRecord> = useMemo(() => [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'ShareFolder', dataIndex: 'isShareFolder', key: 'isShareFolder', render: (v: boolean) => v ? <Badge status="success" text="Yes"/> : <Badge status="default" text="No"/>},
    {title: 'Path', dataIndex: 'path', key: 'path', ellipsis: true},
    {title: 'Flags', key: 'flags', render: (_, r) => (
      <Space size={[8,4]} wrap>
        {r.publicFlag !== undefined && <Tag color={r.publicFlag ? 'green' : 'default'}>public: {r.publicFlag ? 'yes' : 'no'}</Tag>}
        {r.availableFlag !== undefined && <Tag color={r.availableFlag ? 'blue' : 'default'}>available: {r.availableFlag ? 'yes' : 'no'}</Tag>}
        {r.browseableFlag !== undefined && <Tag color={r.browseableFlag ? 'geekblue' : 'default'}>browseable: {r.browseableFlag ? 'yes' : 'no'}</Tag>}
        {r.readOnlyFlag !== undefined && <Tag color={r.readOnlyFlag ? 'gold' : 'default'}>read only: {r.readOnlyFlag ? 'yes' : 'no'}</Tag>}
      </Space>
    )},
  ],[]);

  const filteredData = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    const pq = pathQuery.trim().toLowerCase();
    return data.filter((r) => {
      if (nq && !r.name.toLowerCase().includes(nq)) return false;
      if (pq && !(r.path || '').toLowerCase().includes(pq)) return false;
      if (shareFolderFilter === 'yes' && !r.isShareFolder) return false;
      if (shareFolderFilter === 'no' && r.isShareFolder) return false;
      if (onlyPublic && !r.publicFlag) return false;
      if (onlyAvailable && !r.availableFlag) return false;
      if (onlyBrowseable && !r.browseableFlag) return false;
      if (onlyReadOnly && !r.readOnlyFlag) return false;
      return true;
    });
  },[data,nameQuery,pathQuery,shareFolderFilter,onlyPublic,onlyAvailable,onlyBrowseable,onlyReadOnly]);

  useEffect(() => {
    (async () => {
      const res = await fetchSMBSections();
      if (res?.sections) {
        const parse = (v?: string) => {
          const t = (v || '').trim().toLowerCase();
          return t === 'yes' || t === 'true' || t === '1';
        };
        setData(res.sections.map((s) => ({
          key: s.name,
          name: s.name,
          isShareFolder: s.isShareFolder,
          shareFolderId: s.shareFolderId,
          fields: s.fields,
          path: s.fields?.path,
          publicFlag: parse(s.fields?.['public']),
          availableFlag: parse(s.fields?.['available']),
          browseableFlag: parse(s.fields?.['browseable']),
          readOnlyFlag: parse(s.fields?.['read only']),
        })));
      }
    })();
  },[]);

  return <PageContainer>
    <Card
      title={
        <Space size={[8,8]} wrap>
          <Input allowClear placeholder="Search name" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} style={{width: 200}}/>
          <Input allowClear placeholder="Search path" value={pathQuery} onChange={(e) => setPathQuery(e.target.value)} style={{width: 240}}/>
          <Select
            value={shareFolderFilter}
            style={{width: 160}}
            onChange={(v) => setShareFolderFilter(v)}
            options={[
              {label: 'All', value: 'all'},
              {label: 'ShareFolder = Yes', value: 'yes'},
              {label: 'ShareFolder = No', value: 'no'},
            ]}
          />
          <Checkbox checked={onlyPublic} onChange={(e) => setOnlyPublic(e.target.checked)}>public</Checkbox>
          <Checkbox checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)}>available</Checkbox>
          <Checkbox checked={onlyBrowseable} onChange={(e) => setOnlyBrowseable(e.target.checked)}>browseable</Checkbox>
          <Checkbox checked={onlyReadOnly} onChange={(e) => setOnlyReadOnly(e.target.checked)}>read only</Checkbox>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        expandable={{
          expandedRowRender: (record) => {
            const entries = Object.entries(record.fields || {}).sort(([a],[b]) => a.localeCompare(b));
            return (
              <Descriptions bordered column={1} size="small">
                {entries.map(([k,v]) => (
                  <Descriptions.Item key={k} label={k}>
                    <Tooltip title={v}><span style={{wordBreak:'break-all'}}>{v}</span></Tooltip>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            )
          }
        }}
      />
    </Card>
  </PageContainer>
}


