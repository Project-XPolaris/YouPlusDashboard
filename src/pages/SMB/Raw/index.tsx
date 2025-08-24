// @ts-nocheck
import React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {fetchSMBSections, updateSMBRaw} from '@/services/ant-design-pro/sharefolder';
import {Button, Card, Collapse, Divider, Input, message, Popconfirm, Space, Switch, Tag, Tooltip} from 'antd';
import {PageContainer} from '@ant-design/pro-components';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';

type UIField = {
  id: string;
  keyName: string;
  value: string;
};

type UISection = {
  uid: string;
  name: string;
  isShareFolder: boolean;
  shareFolderId?: number;
  fields: UIField[];
};

const BOOLEAN_KEYS = ['public','available','browseable','read only'];

const isBooleanKey = (k: string) => BOOLEAN_KEYS.includes(k.trim().toLowerCase());
const parseBool = (v?: string) => {
  const t = (v || '').trim().toLowerCase();
  return t === 'yes' || t === 'true' || t === '1';
}
const toBoolStr = (b: boolean) => b ? 'yes' : 'no';

export default () => {
  const [sections, setSections] = useState<UISection[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchSMBSections();
      const list = (res?.sections || []).map((s) => {
        const entries = Object.entries(s.fields || {});
        const fields: UIField[] = entries.map(([k, v], idx) => ({
          id: `${s.name}-${idx}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
          keyName: k,
          value: v,
        }));
        return {
          uid: `${s.name}-${Math.random().toString(36).slice(2,8)}`,
          name: s.name,
          isShareFolder: s.isShareFolder,
          shareFolderId: s.shareFolderId,
          fields,
        } as UISection;
      });
      setSections(list);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  },[])

  const addSection = () => {
    const base = 'new_section';
    let name = base;
    let idx = 1;
    const existing = new Set(sections.map(s => s.name));
    while (existing.has(name)) { name = `${base}_${idx++}` }
    setSections(prev => ([
      ...prev,
      { uid: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, name, isShareFolder: false, fields: [] }
    ]));
  };

  const removeSection = (uid: string) => {
    setSections(prev => prev.filter(s => s.uid !== uid));
  };

  const addField = (uid: string) => {
    setSections(prev => prev.map(s => s.uid === uid ? {
      ...s,
      fields: [...s.fields, { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, keyName: '', value: '' }]
    } : s));
  };

  const removeField = (uid: string, fid: string) => {
    setSections(prev => prev.map(s => s.uid === uid ? {
      ...s,
      fields: s.fields.filter(f => f.id !== fid)
    } : s));
  };

  const updateSectionName = (uid: string, name: string) => {
    setSections(prev => prev.map(s => s.uid === uid ? { ...s, name } : s));
  };

  const updateFieldKey = (uid: string, fid: string, keyName: string) => {
    setSections(prev => prev.map(s => s.uid === uid ? {
      ...s,
      fields: s.fields.map(f => f.id === fid ? { ...f, keyName } : f)
    } : s));
  };

  const updateFieldValue = (uid: string, fid: string, value: string) => {
    setSections(prev => prev.map(s => s.uid === uid ? {
      ...s,
      fields: s.fields.map(f => f.id === fid ? { ...f, value } : f)
    } : s));
  };

  const rawText = useMemo(() => {
    const sb: string[] = [];
    sections.forEach((s) => {
      const name = (s.name || '').trim();
      if (!name) return;
      sb.push(`[${name}]`);
      s.fields.forEach((f) => {
        const k = (f.keyName || '').trim();
        if (!k) return;
        const v = (f.value || '').toString();
        sb.push(`    ${k} = ${v}`);
      });
      sb.push('', '');
    });
    return sb.join('\n');
  }, [sections]);

  const save = async () => {
    setSaving(true);
    try {
      await updateSMBRaw(rawText);
      message.success('保存并重启 SMB 成功');
      setTimeout(refresh, 1200);
    } catch (e) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  }

  return <PageContainer>
    <Space direction="vertical" style={{width: '100%'}}>
      <Card
        title={<Space>
          <Button type="primary" onClick={addSection} icon={<PlusOutlined/>}>新增 Section</Button>
          <Tag color="default">共 {sections.length} 个 section</Tag>
        </Space>}
        extra={<Button type="primary" onClick={save} loading={saving}>保存</Button>}
        loading={loading}
      >
        <Collapse accordion>
          {sections.map((s) => (
            <Collapse.Panel
              key={s.uid}
              header={<Space size={[8,4]} wrap>
                <strong>{s.name || '(未命名 section)'}</strong>
                {s.isShareFolder && <Tag color="green">ShareFolder</Tag>}
              </Space>}
              extra={
                <Popconfirm title="删除该 section?" onConfirm={(e) => { e?.stopPropagation(); removeSection(s.uid); }} onCancel={(e) => e?.stopPropagation()}>
                  <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                </Popconfirm>
              }
            >
              <Space direction="vertical" style={{width: '100%'}} size="middle">
                <div>
                  <div style={{marginBottom: 8}}>Name</div>
                  <Input value={s.name} onChange={(e) => updateSectionName(s.uid, e.target.value)} placeholder="例如：global 或共享名称"/>
                </div>
                <Divider style={{margin: '8px 0'}}/>
                <Space direction="vertical" style={{width: '100%'}} size="small">
                  {s.fields.map((f) => {
                    const keyLower = (f.keyName || '').trim().toLowerCase();
                    const isBool = isBooleanKey(keyLower);
                    return (
                      <div key={f.id} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        <Input
                          style={{width: 220}}
                          placeholder="字段名，如 path / public"
                          value={f.keyName}
                          onChange={(e) => updateFieldKey(s.uid, f.id, e.target.value)}
                        />
                        {isBool ? (
                          <Space>
                            <Switch
                              checked={parseBool(f.value)}
                              onChange={(checked) => updateFieldValue(s.uid, f.id, toBoolStr(checked))}
                            />
                            <Tag color={parseBool(f.value) ? 'green' : 'default'}>
                              {parseBool(f.value) ? 'yes' : 'no'}
                            </Tag>
                          </Space>
                        ) : (
                          <Input
                            style={{flex: 1}}
                            placeholder="字段值"
                            value={f.value}
                            onChange={(e) => updateFieldValue(s.uid, f.id, e.target.value)}
                          />
                        )}
                        <Tooltip title="删除字段">
                          <Button danger type="text" icon={<DeleteOutlined/>} onClick={() => removeField(s.uid, f.id)} />
                        </Tooltip>
                      </div>
                    )
                  })}
                  <div>
                    <Button size="small" icon={<PlusOutlined/>} onClick={() => addField(s.uid)}>新增字段</Button>
                  </div>
                </Space>
              </Space>
            </Collapse.Panel>
          ))}
        </Collapse>
      </Card>
      <Card title="将要保存的配置 (预览)" size="small">
        <Input.TextArea
          rows={12}
          value={rawText}
          readOnly
          spellCheck={false}
          style={{fontFamily: 'monospace'}}
        />
      </Card>
    </Space>
  </PageContainer>
}


