import {ModalForm, ProFormSelect} from "@ant-design/pro-form";
import {Form} from "antd";
import {useEffect} from "react";
import useAccountList from "@/hooks/user";
import styles from "@/components/CreateShareFolderDialog/index.less";

type SelectAccountFormValues = {
  account?: string[]
}
type SelectAccountDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: SelectAccountFormValues) => void;
  initialValues?: SelectAccountFormValues
}

const SelectAccountDialog = ({visible, onCancel, onOk, initialValues}: SelectAccountDialogProps) => {
  const [form] = Form.useForm();
  const accountList = useAccountList()
  useEffect(() => {
    accountList.refresh()
  }, [])
  return (
    <ModalForm<SelectAccountFormValues>
      title="Select Account"
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
        name="account"
        label="Account"
        placeholder="Account"
        options={accountList.accounts}
        initialValue={initialValues?.account}
        mode={'multiple'}
      />
    </ModalForm>
  )
}
export default SelectAccountDialog;
