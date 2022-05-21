import {StatisticCard} from "@ant-design/pro-card";
import {EllipsisOutlined} from "@ant-design/icons";
import {Space} from "antd";
import filesize from "filesize";
import {Progress} from "@ant-design/plots";

export default ({info}: { info: API.ZPool | undefined }) => {
  const getUsage = () => {
    if (info) {
      return (info.tree.alloc / (info.tree.alloc + info.tree.free)) * 100;
    }
    return 0;
  }
  return (
    <StatisticCard
      title="ZFS Pool"
      subTitle={info?.name}
      extra={<EllipsisOutlined />}
      statistic={{
        value: getUsage(),
        suffix: '%',
        precision: 2,
        description: (
          <Space>
            <StatisticCard.Statistic title="used" value={filesize(info?.tree.alloc || 0)} />
            <StatisticCard.Statistic title="total" value={filesize((info?.tree.alloc || 0) + (info?.tree.free || 0))} />
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
