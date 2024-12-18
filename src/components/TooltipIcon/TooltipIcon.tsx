import { Tooltip, TooltipProps } from '@arco-design/web-react';
import { IconQuestionCircle } from '@arco-design/web-react/icon';

type Props = TooltipProps & {
  iconClassName?: string;
};

const TooltipIcon = (props: Props) => {
  const { iconClassName, ...rest } = props;

  return (
    <Tooltip {...rest}>
      <IconQuestionCircle
        className={iconClassName}
        style={{ color: iconClassName ? undefined : 'lightgrey' }}
      />
    </Tooltip>
  );
};

export default TooltipIcon;
