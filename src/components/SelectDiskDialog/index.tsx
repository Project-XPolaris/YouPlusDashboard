import {ModalForm, ProFormSelect} from "@ant-design/pro-form";
import {Form} from "antd";
import {useEffect} from "react";
import styles from "@/components/CreateShareFolderDialog/index.less";
import useDiskList from "@/hooks/disk";

export type SelectDiskFormValues = {
  disks?: string[]
}
type SelectDiskDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: SelectDiskFormValues) => void;
}

const SelectDiskDialog = ({visible, onCancel, onOk }: SelectDiskDialogProps) => {
  const [form] = Form.useForm();
  const diskList = useDiskList()
  useEffect(() => {
    if (visible){
      diskList.refresh()
    }
  }, [visible])
  return (
    <ModalForm<SelectDiskFormValues>
      title="Select Disk"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        onCancel
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onOk(values);
        return true;
      }}
      form={form}
    >
      <ProFormSelect
        className={styles.input}
        name="disks"
        label="Disks"
        placeholder="Disks"
        options={diskList.diskList.map(it => it.name)}
        mode={'multiple'}
      />
    </ModalForm>
  )
}
export default SelectDiskDialog;
