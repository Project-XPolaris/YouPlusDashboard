import {StatisticCard} from "@ant-design/pro-card";
import {Space} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";
import {Progress} from '@ant-design/plots';
import filesize from "filesize";

export default ({info}: { info: API.Storage | undefined }) => {
  const getUsage = () => {
    if (info) {
      return (info.used / info.total) * 100;
    }
    return 0;
  }
  return (
    <StatisticCard
      title="Storage"
      subTitle={`${info?.id} (${info?.type})`}
      extra={<EllipsisOutlined />}
      statistic={{
        value: getUsage(),
        suffix: '%',
        precision: 2,
        description: (
          <Space>
            <StatisticCard.Statistic title="used" value={filesize(info?.used || 0)} />
            <StatisticCard.Statistic title="total" value={filesize(info?.total || 0)} />
          </Space>
        ),
      }}
      chart={
        <>
          <Progress percent={getUsage()} autoFit width={120} height={32} />
        </>
      }
    />
  );
};
