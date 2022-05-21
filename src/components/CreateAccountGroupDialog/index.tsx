import {ModalForm, ProFormText,} from '@ant-design/pro-form';
import styles from './index.less';
import {Form} from "antd";

export type CreateAccountGroupDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: ({name}: { name: string }) => void;
}
const CreateAccountGroupDialog = (
  {
    visible, onCancel, onOk,
  }: CreateAccountGroupDialogProps) => {
  const [form] = Form.useForm();
  return (
    <ModalForm<{
     name: string
    }>
      title="创建账号组"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        onCancel
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onOk({name: values.name});
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

    </ModalForm>
  );
};
export default CreateAccountGroupDialog
