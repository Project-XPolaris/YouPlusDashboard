import {ModalForm, ProFormSelect, ProFormText,} from '@ant-design/pro-form';
import useDiskList from "@/hooks/disk";
import {useEffect} from "react";
import styles from './index.less';

export type CreateSimpleZFSPoolDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: ({name, disks}: { name: string, disks: string[] }) => void;
}
const CreateSimpleZFSPoolDialog = (
  {
    visible, onCancel, onOk,
  }: CreateSimpleZFSPoolDialogProps) => {
  const diskList = useDiskList()
  useEffect(() => {
    diskList.refresh()
  }, [])
  const disksOptions: string[] = diskList.diskList.map(disk => disk.name)
  return (
    <ModalForm<{
      name: string;
      disks: string[];
    }>
      title="创建新的ZFS Pool"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        onCancel
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        onOk(values)
      }}
    >
      <ProFormText
        className={styles.input}
        name="name"
        label="名称"
        placeholder="请输入名称"
      />
      <ProFormSelect
        className={styles.input}
        name={'disks'}
        mode={'multiple'}
        label="选择磁盘"
        placeholder="请选择磁盘"
        options={disksOptions}
      />
    </ModalForm>
  );
};
export default CreateSimpleZFSPoolDialog;
