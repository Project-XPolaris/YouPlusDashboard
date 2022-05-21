import ProCard from "@ant-design/pro-card";
import {Alert} from "antd";
import Title from "antd/lib/typography/Title";

const InstallAppTaskCard = ({task}: {task: API.Task}) => {
  const extra = task.extra as API.AppInstallTaskOutput;
  return (
    <ProCard title={`Install app ${extra.appName}`} bordered >
      <Title level={4}>{task.status}</Title>
      {
        task.status == "Error" &&
        <Alert type={'error'} message={task.errorMessage} />
      }
    </ProCard>
  )
}
export default InstallAppTaskCard;
