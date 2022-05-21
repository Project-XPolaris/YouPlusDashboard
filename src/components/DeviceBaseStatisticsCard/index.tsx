import { useState } from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';

const { Divider } = StatisticCard;

export default ({info}: {info: API.DeviceInfo | null}) => {
  const [responsive, setResponsive] = useState(false);

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group title="Device info" direction={responsive ? 'column' : 'row'} loading={!info}>
        <StatisticCard
          statistic={{
            title: 'Folder',
            value: info?.shareFolderCount,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: 'User',
            value: info?.userCount,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: 'Pool',
            value: info?.zfsCount,
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Disk',
            value: info?.diskCount,
          }}
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
};
