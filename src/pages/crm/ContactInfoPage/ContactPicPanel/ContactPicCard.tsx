import {
  Space,
  Card,
  Button,
  Descriptions,
  DescriptionsProps,
} from '@arco-design/web-react';
import { MdNotes, MdOutlineMailOutline, MdPhone } from 'react-icons/md';

import { Avatar } from '@/components';

import styles from './ContactPicCard.module.less';

import type { ArrayElement } from '@/types';

import type { ContactInfoPageQuery } from 'generated/graphql-types';

type QueryContactPic = ArrayElement<
  NonNullable<ContactInfoPageQuery['contact']>['pics']
>;

type Props = {
  pic: QueryContactPic;
  onEdit: () => void;
};

const ContactPicCard = (props: Props) => {
  const { pic, onEdit } = props;

  const data: DescriptionsProps['data'] = [
    {
      label: <MdOutlineMailOutline />,
      value: pic?.user?.email || '-',
    },
    {
      label: <MdPhone />,
      value: pic?.contactNo,
    },
    {
      label: <MdNotes />,
      value: pic?.remarks || '-',
    },
  ];

  return (
    <Card
      className={styles['contact-pic-card']}
      bordered
      title={
        <Space>
          <Avatar size={25} name={pic?.name as string} />
          {pic?.name}
        </Space>
      }
      extra={
        <Button type="text" onClick={onEdit}>
          Edit
        </Button>
      }
    >
      <Descriptions column={1} data={data} />
    </Card>
  );
};

export default ContactPicCard;
