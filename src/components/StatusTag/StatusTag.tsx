import { Tag } from '@arco-design/web-react';
import { ReactNode } from 'react';

type ColorMode =
  | 'red'
  | 'green'
  | 'blue'
  | 'green-2'
  | 'red-2'
  | 'blue-2'
  | 'blue-3';

type Props = {
  children: ReactNode;
  mode?: ColorMode;
};

const getColor = (mode?: ColorMode) => {
  const colors: Record<ColorMode, { text: string; background: string }> = {
    green: {
      text: '#00B42A',
      background: '#E8FFEA',
    },
    'green-2': {
      text: '#00B42A',
      background: '#AFF0B5',
    },
    red: {
      text: '#D6001C',
      background: '#FFE5E9',
    },
    'red-2': {
      text: '#F53F3F',
      background: '#FFECE8',
    },
    blue: {
      text: '#3491FA',
      background: '#E8F7FF',
    },
    'blue-2': {
      text: '#3491FA',
      background: '#C3E7FE',
    },
    'blue-3': {
      text: '#0FC6C2',
      background: '#E8FFFB',
    },
  };

  return mode ? colors[mode] : undefined;
};

const StatusTag = (props: Props) => {
  const { mode, children } = props;

  const color = getColor(mode);

  return (
    <Tag
      style={{ fontWeight: '600', color: color?.text }}
      color={color?.background}
      bordered={true}
    >
      {children}
    </Tag>
  );
};

export default StatusTag;
