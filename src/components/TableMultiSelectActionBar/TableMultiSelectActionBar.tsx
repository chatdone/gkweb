import {
  Button,
  Divider,
  Grid,
  Space,
  Typography,
} from '@arco-design/web-react';
import { Fragment, ReactNode } from 'react';

import styles from './TableMultiSelectActionBar.module.less';

type Props = {
  numberOfRows: number;
  actions: ReactNode;
  onDeselectAll: () => void;
  suffix?: string;
  align?: 'left' | 'right';
};

const TableMultiSelectActionBar = (props: Props) => {
  const {
    numberOfRows,
    actions,
    suffix = 'rows',
    align = 'left',
    onDeselectAll,
  } = props;

  return (
    <Grid.Row
      className={styles.wrapper}
      justify={align === 'left' ? 'start' : 'end'}
      align="center"
    >
      <Space
        size={0}
        split={<Divider className={styles.divider} type="vertical" />}
      >
        <Typography.Text style={{ fontWeight: '600' }}>
          Selected {numberOfRows} {suffix}
        </Typography.Text>

        <Button size="small" type="text" onClick={onDeselectAll}>
          Deselect all
        </Button>

        {Array.isArray(actions)
          ? actions.map((action, index) => (
              <Fragment key={index}>{action}</Fragment>
            ))
          : actions}
      </Space>
    </Grid.Row>
  );
};

export default TableMultiSelectActionBar;
