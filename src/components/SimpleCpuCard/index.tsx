import { EllipsisOutlined } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-card';
export default ({ info }: {info: API.CpuUsage | undefined}) => {
  const getUsage = () => {
    if (!info || info.total === 0) {
      return 0;
    }
    return ((info.iowait + info.system + info.user) / info.total) * 100
  }
  return (
    <StatisticCard
      title="CPU"
      extra={<EllipsisOutlined />}
      statistic={{
        value: getUsage(),
        suffix: '%',
        precision: 2,
        description: 'Usage of CPU',
      }}
    />
  );
};
