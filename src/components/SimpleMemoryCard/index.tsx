import {StatisticCard} from '@ant-design/pro-card';
import filesize from "filesize";

export default ({ info }: {info?: API.MemoryUsage}) => {
  const getValue = () => {
    if (!info || info.total === 0) {
      return 0;
    }
    return ((info.total - info.free) / info.total) * 100
  }
  return (
    <StatisticCard
      title="Memory"
      statistic={{
        value: getValue(),
        suffix: '%',
        precision: 2,
        description: `${filesize((info?.total || 0 ) - (info?.free || 0))}/${filesize(info?.total || 0)}`,
      }}
    />
  );
};
