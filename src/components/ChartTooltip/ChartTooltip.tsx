import { Typography, Badge } from '@arco-design/web-react';
import type { TooltipCfg } from 'bizcharts/lib/interface';
import { lazy, Suspense } from 'react';

import styles from './ChartTooltip.module.less';

const Tooltip = lazy(() =>
  import('bizcharts').then((module) => ({ default: module.Tooltip })),
);

type Props = {
  title: string;
  data: {
    name: string;
    value: string;
    color: string;
  }[];
  color?: string;
  name?: string;
  formatter?: (value: string) => React.ReactNode;
  showBadge?: boolean;
  config?: TooltipCfg;
};

const ChartTooltip = (props: Omit<Props, 'title' | 'data'>) => {
  const { config, ...rest } = props;

  return (
    <Suspense>
      <Tooltip
        showCrosshairs={true}
        showMarkers={true}
        domStyles={{
          'g2-tooltip': {
            background:
              'linear-gradient(304.17deg, rgba(253, 254, 255, 0.6) -6.04%, rgba(244, 247, 252, 0.6) 85.2%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '6px',
          },
        }}
        {...config}
      >
        {(title, items) => {
          return (
            <CustomToolTip
              title={title as string}
              data={
                items as {
                  name: string;
                  value: string;
                  color: string;
                }[]
              }
              {...rest}
            />
          );
        }}
      </Tooltip>
    </Suspense>
  );
};

const CustomToolTip = (props: Props) => {
  const {
    formatter = (value) => value,
    color,
    name,
    title,
    data,
    showBadge = true,
  } = props;

  return (
    <div className={styles.tooltip}>
      <div className={styles['title-container']}>
        <Typography.Text className={styles.title}>{title}</Typography.Text>
      </div>

      <div>
        {data.map((item, index) => (
          <div key={index} className={styles.item}>
            <div>
              {showBadge && <Badge color={color || item.color} />}

              <Typography.Text>{name || item.name}</Typography.Text>
            </div>

            <div className={styles.value}>
              <Typography.Text>{formatter(item.value)}</Typography.Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTooltip;
