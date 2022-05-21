import {ModalForm, ProFormText} from "@ant-design/pro-form";

type UpdateStorageFormProps = {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: UpdateStorageFormValues) => void;
    initialValues?: API.Storage;
};
export type UpdateStorageFormValues = {
  name?: string
}
const UpdateStorageForm = ({visible,onCancel,onSubmit,initialValues}: UpdateStorageFormProps) => {
  return (
    <ModalForm<UpdateStorageFormValues>
      title="Update Storage"
      autoFocusFirstInput
      visible={visible}
      initialValues={initialValues}
      modalProps={{
        onCancel: onCancel,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        onSubmit(values)
        return true;
      }}
    >
      <ProFormText  name="name" label="storage name" />
    </ModalForm>
  );
}
export default UpdateStorageForm;
