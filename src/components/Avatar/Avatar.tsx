import {
  Avatar as ArcoAvatar,
  AvatarProps,
  Tooltip,
} from '@arco-design/web-react';

import styles from './Avatar.module.less';

type Props = AvatarProps & {
  name?: string | null;
  imageSrc?: string | null;
  showTooltip?: boolean;
  imageClassName?: string;
};

const Avatar = (props: Props) => {
  const { name, imageSrc, showTooltip, imageClassName, ...rest } = props;

  return (
    <Tooltip content={showTooltip ? name : undefined}>
      <ArcoAvatar {...rest}>
        {imageSrc ? (
          <img
            className={`${styles.img} ${imageClassName}`}
            alt="avatar"
            src={imageSrc}
          />
        ) : (
          getNameInitials(name)
        )}
      </ArcoAvatar>
    </Tooltip>
  );
};

export const getNameInitials = (name: string | null | undefined) => {
  if (!name) {
    return '';
  }

  const words = name
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter((word) => word);

  return words
    .map((word) => word[0])
    .slice(0, 2)
    .join('');
};

Avatar.Group = ArcoAvatar.Group;

export default Avatar;
