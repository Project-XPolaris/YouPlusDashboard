import {PageContainer} from "@ant-design/pro-layout";
import CreateShareFolderDialog from "@/components/CreateShareFolderDialog";
import {useEffect, useState} from "react";
import useShareFolderListModel from "@/pages/ShareFolder/List/model";
import {Button, Card, Switch, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import filesize from "filesize";
import {Link} from "umi";

type ShareFolderItem = {
  id: string;
  name: string;
  storageId: string;
  storageType: string;
  used: number;
  total: number;
  enable: boolean;
  public: boolean;
  readonly: boolean;
}
const ShareFolderListPage = () => {
  const model = useShareFolderListModel();
  const [createShareFolderDialogVisible, setCreateShareFolderDialogVisible] = useState(false);
  const folders: ShareFolderItem[] = model.shareFolderList.map((folder: API.ShareFolder) => ({
    id: folder.id,
    name: folder.name,
    storageId: folder.storage.id,
    storageType: folder.storage.type,
    used: folder.storage.used,
    total: folder.storage.total,
    enable: folder.enable,
    public: folder.public,
    readonly: folder.readonly,
  }));
  const columns: ColumnsType<ShareFolderItem> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ShareFolderItem) => <Link to={`/sharefolder/${record.name}`}>{name}</Link>,
    },
    {
      title: 'Used',
      dataIndex: 'used',
      key: 'used',
      render: (value: number) => filesize(value),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => filesize(value),
    },
    {
      title: 'Enable',
      dataIndex: 'enable',
      key: 'enable',
      render:(value,record) => <Switch
        checked={value}
        onChange={(e) => model.update(record.name,{enable:e}) }
      />
    },
    {
      title: 'Public',
      dataIndex: 'public',
      key: 'public',
      render:(value,record) => <Switch
        checked={value}
        onChange={(e) => model.update(record.name,{public:e}) }
      />
    }
  ]
  useEffect(() => {
    model.refresh()
  },[])
  return (
    <PageContainer
      extra={[
        <Button
          key="1"
          onClick={() => setCreateShareFolderDialogVisible(true)}
        >Create</Button>,
      ]}
    >
      <CreateShareFolderDialog
        visible={createShareFolderDialogVisible}
        onCancel={() => setCreateShareFolderDialogVisible(false)}
        onOk={model.create}
      />
      <Card>
        <Table dataSource={folders} columns={columns} />
      </Card>
    </PageContainer>
  );
}
export default ShareFolderListPage;
