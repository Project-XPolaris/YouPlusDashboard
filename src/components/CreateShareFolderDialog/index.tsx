import {ModalForm, ProFormSelect, ProFormText,} from '@ant-design/pro-form';
import styles from './index.less';
import {Form} from "antd";
import useStorageList from "@/hooks/storage";
import {useEffect} from "react";
import type { DefaultOptionType } from 'antd/lib/select';

export type CreateShareFolderDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: ({name,storage}: { name: string,storage: string }) => void;
}
const CreateShareFolderDialog = (
  {
    visible, onCancel, onOk,
  }: CreateShareFolderDialogProps) => {
  const storageList = useStorageList();
  useEffect(() => {
    storageList.refresh();
  },[])
  const [form] = Form.useForm();
  const storageOption: DefaultOptionType[] = storageList.storageList.map(item => ({
    value: item.id,
    label: item.name,
  }));
  return (
    <ModalForm<{
     name: string
      storage: string
    }>
      title="创建共享文件夹"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        onCancel
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onOk({name: values.name,storage:values.storage});
      }}
      form={form}
    >
      <ProFormText
        className={styles.input}
        name="name"
        label="名称"
        placeholder="请输入名称"
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormSelect<API.Storage>
        className={styles.input}
        name="storage"
        label="存储"
        placeholder="存储"
        rules={[
          {
            required: true,
          }
        ]}
        options={storageOption}
      />
    </ModalForm>
  );
};
export default CreateShareFolderDialog
