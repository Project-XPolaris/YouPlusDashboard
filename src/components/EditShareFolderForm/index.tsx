import type {
  ProFormInstance} from "@ant-design/pro-form";
import {
  DrawerForm,
  ProForm,
  ProFormSelect, ProFormSwitch
} from "@ant-design/pro-form";
import {useEffect, useRef} from "react";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useAccountList from "@/hooks/user";
import useUserGroupList from "@/hooks/usergroup";
export type EditShareFolderFormValues = {
  enable: boolean;
  public: boolean;
  readonly: boolean;
  readUsers: string[];
  writeUsers: string[];
  validUsers: string[];
  invalidUsers: string[];
  readGroups: string[];
  writeGroups: string[];
  validGroups: string[];
  invalidGroups: string[];
}
type EditShareFolderFormProps = {
  shareFolder: API.ShareFolder | null;
  onUpdate: (value: EditShareFolderFormValues) => void;
}

const EditShareFolderForm = ({shareFolder,onUpdate}: EditShareFolderFormProps) => {
  const accountList = useAccountList()
  const groupList = useUserGroupList()
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    accountList.refresh()
    groupList.refresh()
  },[])
  if (!shareFolder) {
    return (<></>);
  }

  return (
    <DrawerForm<EditShareFolderFormValues>
      title={`修改${shareFolder.name}`}
      formRef={formRef}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          修改配置
        </Button>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onUpdate(values)
        // 不返回不会关闭弹框
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormSwitch
          name="enable"
          width="md"
          label="启用"
          initialValue={shareFolder.enable}
        />
        <ProFormSwitch
          name="public"
          width="md"
          label="公共访问"
          initialValue={shareFolder.public}
        />
        <ProFormSwitch
          name="readonly"
          width="md"
          label="只读"
          initialValue={shareFolder.readonly}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="validUsers"
          label="Valid Users"
          placeholder="Valid Users"
          initialValue={shareFolder.validUsers.map(user => user.name)}
          options={accountList.accounts}
          mode={"multiple"}
        />
        <ProFormSelect
          width="md"
          name="invalidUsers"
          label="Invalid Users"
          placeholder="invalid Users"
          initialValue={shareFolder.invalidUsers.map(user => user.name)}
          options={accountList.accounts}
          mode={"multiple"}
        />
        <ProFormSelect
          width="md"
          name="writeUsers"
          label="Write Users"
          placeholder="write Users"
          initialValue={shareFolder.writeUsers.map(user => user.name)}
          options={accountList.accounts}
          mode={"multiple"}
        />
        <ProFormSelect
          width="md"
          name="readUsers"
          label="Read Users"
          placeholder="Read Users"
          initialValue={shareFolder.readUsers.map(user => user.name)}
          options={accountList.accounts}
          mode={"multiple"}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="validGroups"
          label="valid Groups"
          placeholder="valid Groups"
          initialValue={shareFolder.validGroups.map(group => group.name)}
          options={groupList.userGroupList.map(it => it.name)}
          mode={"multiple"}
        />
        <ProFormSelect
          width="md"
          name="invalidGroups"
          label="Invalid Groups"
          placeholder="Invalid Groups"
          initialValue={shareFolder.validGroups.map(group => group.name)}
          options={groupList.userGroupList.map(it => it.name)}
          mode={"multiple"}
        />
        <ProFormSelect
          width="md"
          name="readGroups"
          label="Read Groups"
          placeholder="Read Groups"
          initialValue={shareFolder.readGroups.map(group => group.name)}
          options={groupList.userGroupList.map(it => it.name)}
          mode={"multiple"}
        />
        <ProFormSelect
          width="md"
          name="writeGroups"
          label="Write Groups"
          placeholder="Write Groups"
          initialValue={shareFolder.writeGroups.map(group => group.name)}
          options={groupList.userGroupList.map(it => it.name)}
          mode={"multiple"}
        />
      </ProForm.Group>
    </DrawerForm>
  );
}
export default EditShareFolderForm;
