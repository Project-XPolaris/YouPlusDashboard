import {ModalForm, ProFormText,} from '@ant-design/pro-form';
import styles from './index.less';
import {LockOutlined} from "@ant-design/icons";
import {Form} from "antd";

export type CreateUserDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: ({username, password}: { username: string, password: string }) => void;
}
const CreateUserDialog = (
  {
    visible, onCancel, onOk,
  }: CreateUserDialogProps) => {
  const [form] = Form.useForm();
  return (
    <ModalForm<{
      username: string;
      password: string;
      repassword: string;
    }>
      title="创建用户"
      autoFocusFirstInput
      visible={visible}
      modalProps={{
        onCancel
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onOk({username: values.username, password: values.password});
      }}
      form={form}
    >
      <ProFormText
        className={styles.input}
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        rules={[
          {
            required: true,
          }
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined/>,
        }}
        placeholder={'密码'}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
      <ProFormText.Password
        name="repassword"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined/>,
        }}
        placeholder={'确认密码'}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
          {
            validator: (rule, value) => {
              if (value && value !== form.getFieldValue('password')) {
                return Promise.reject('两次输入的密码不一致！');
              }
              return Promise.resolve();
            }
          }
        ]}
      />


    </ModalForm>
  );
};
export default CreateUserDialog
