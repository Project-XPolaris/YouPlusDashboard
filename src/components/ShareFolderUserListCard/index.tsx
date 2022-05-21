import ProCard from "@ant-design/pro-card";
import type {ProColumns} from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {Tabs} from "antd";

type AccessItems = {
    id: string;
    name: string;
    type: string;
}
export default ({ shareFolder }: {shareFolder: API.ShareFolder | undefined | null}) => {
  const column: ProColumns<AccessItems>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    }
  ]
  const getValidList = (): AccessItems[] => {
    if (!shareFolder) {
      return []
    }
    return [
      ...shareFolder.validUsers.map(it => ({name: it.name, id: it.uid, type: "User"})),
      ...shareFolder.validGroups.map(it => ({name: it.name, id: it.gid, type: "Group"}))]
  }
  const getInvalidList = (): AccessItems[] => {
    if (!shareFolder) {
      return []
    }
    return [
      ...shareFolder.invalidUsers.map(it => ({name: it.name, id: it.uid, type: "User"})),
      ...shareFolder.invalidGroups.map(it => ({name: it.name, id: it.gid, type: "Group"}))]
  }
  const getReadList = (): AccessItems[] => {
    if (!shareFolder) {
      return []
    }
    return [
      ...shareFolder.readUsers.map(it => ({name: it.name, id: it.uid, type: "User"})),
      ...shareFolder.readGroups.map(it => ({name: it.name, id: it.gid, type: "Group"}))]
  }
  const getWriteList = (): AccessItems[] => {
    if (!shareFolder) {
      return []
    }
    return [
      ...shareFolder.writeUsers.map(it => ({name: it.name, id: it.uid, type: "User"})),
      ...shareFolder.writeGroups.map(it => ({name: it.name, id: it.gid, type: "Group"}))]
  }
  return (
    <ProCard
      title={"Access"}
    >
        <Tabs tabPosition={"left"}>
          <Tabs.TabPane tab="Valid" key="1">
            <ProTable
              columns={column}
              dataSource={getValidList()}
              search={false}
             />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Invalid" key="2">
            <ProTable
              columns={column}
              dataSource={getInvalidList()}
              search={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Read" key="3">
            <ProTable
              columns={column}
              dataSource={getReadList()}
              search={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Write" key="4">
            <ProTable
              columns={column}
              dataSource={getWriteList()}
              search={false}
            />
          </Tabs.TabPane>
        </Tabs>

    </ProCard>
  );
};
