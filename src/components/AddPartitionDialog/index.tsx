import {Form} from "antd";
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import styles from "@/components/CreateAccountGroupDialog/index.less";

export type AddPartitionDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: ({size}: { size: string }) => void;
}
const AddPartitionDialog = (
  {
    visible, onCancel, onOk,
  }: AddPartitionDialogProps) => {
  const [form] = Form.useForm();
  return (
    <ModalForm<{
      name: string
    }>
      title="New Partition"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        onCancel
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onOk({size: values.name});
        return true;
      }}
      form={form}
    >
      <ProFormText
        className={styles.input}
        name="size"
        label="Size"
        placeholder="Partition size"
        rules={[
          {
            required: true,
          }
        ]}
      />

    </ModalForm>
  );
};
export default AddPartitionDialog
