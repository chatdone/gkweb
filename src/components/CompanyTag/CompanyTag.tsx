import { Tag, TagProps } from '@arco-design/web-react';
import chroma from 'chroma-js';
import { ReactNode } from 'react';

type Props = Omit<TagProps, 'color'> & {
  children: ReactNode;
  className?: TagProps['className'];
  color?: string | null;
};

const CompanyTag = (props: Props) => {
  const { className, color: propColor, children, ...rest } = props;

  const color =
    propColor && chroma.valid(propColor) ? chroma(propColor) : undefined;

  return (
    <Tag
      className={className}
      style={{ color: color?.css() }}
      color={color?.alpha(0.1).css()}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default CompanyTag;
