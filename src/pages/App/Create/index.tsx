import {PageContainer} from "@ant-design/pro-layout";
import {useRef, useState} from "react";
import type {ProFormInstance} from "@ant-design/pro-form";
import {ProFormText, StepsForm} from "@ant-design/pro-form";
import ProCard from "@ant-design/pro-card";
import {Button, message} from 'antd';
import Dragger from "antd/es/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import useCreateAppModel from "@/pages/App/Create/model";
import SelectFolderDialog from "@/components/SelectFolderDialog";

const CreateAppPage = () => {
  const model = useCreateAppModel()
  const formRef = useRef<ProFormInstance>();
  const [uploadFile, setUploadFile] = useState<File | undefined>();
  const [selectFolderDialogVisible, setSelectFolderDialogVisible] = useState(false);
  const [selectFolderTarget, setSelectFolderTarget] = useState<string | undefined>();
  const renderSelectFolderArg = (arg: API.AppInstallerArg) => {
    return (
      <div>
        <ProFormText name={arg.key} label={arg.name} disabled={true}  extra={ <Button
          onClick={() => {
            setSelectFolderTarget(arg.key);
            setSelectFolderDialogVisible(true);
          }}>Select</Button>}/>
      </div>
    )
  }
  const renderArgs = (args: API.AppInstallerArg[]) => {
    return args.map((arg: API.AppInstallerArg) => {
      switch (arg.type) {
        case "path":
          return renderSelectFolderArg(arg);
        default:
          return <ProFormText name={arg.key} label={arg.name}/>
      }
    })
  };
  return (
    <PageContainer>
      <SelectFolderDialog
        visible={selectFolderDialogVisible}
        onCancel={() => setSelectFolderDialogVisible(false)}
        onOk={(folder) => {
          if (selectFolderTarget) {
            let selectPath = folder;
            if (!selectPath.startsWith("/")) {
              selectPath = "/" + selectPath;
            }
            formRef.current?.setFieldsValue({[selectFolderTarget]: selectPath});
            setSelectFolderDialogVisible(false);
          }
        }}
      />
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          onFinish={async (values) => {
            console.log(values)
            message.success('提交成功');
            await model.install(values);
          }}

          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}

        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="base"
            title="上传文件"
            stepProps={{
              description: '上传安装包',
            }}
            onFinish={async () => {
              console.log(uploadFile);
              if (!uploadFile) {
                message.error('请选择文件');
                return false;
              }
              return await model.upload(uploadFile);
            }}
          >
            <Dragger
              beforeUpload={(file) => {
                setUploadFile(file);
                return false;
              }}
              multiple={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined/>
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
              </p>
            </Dragger>
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="checkbox"
            title="设置参数"
            stepProps={{
              description: '安装应用时的参数',
            }}
            onFinish={async () => {
              console.log(formRef.current?.getFieldsValue());
              return true;
            }}
          >
            {
              renderArgs(model.appInfo?.args ?? [])
            }
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  )
}
export default CreateAppPage
