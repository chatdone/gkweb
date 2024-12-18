import { Space, Tooltip, TriggerProps } from '@arco-design/web-react';
import { IconQuestionCircle } from '@arco-design/web-react/icon';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  tooltip?: ReactNode;
  getPopupContainer?: TriggerProps['getPopupContainer'];
};

const FormLabel = (props: Props) => {
  const { label, tooltip, getPopupContainer } = props;

  return (
    <Space>
      {label}

      {tooltip && (
        <Tooltip
          content={tooltip}
          triggerProps={{
            getPopupContainer,
          }}
        >
          <IconQuestionCircle style={{ color: 'lightgrey' }} />
        </Tooltip>
      )}
    </Space>
  );
};

export default FormLabel;
