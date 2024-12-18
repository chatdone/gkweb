import { Grid, Space, Typography } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { MdOutlinePeople } from 'react-icons/md';

import { Avatar } from '@/components';

import styles from './ListItem.module.less';

import { ArrayElement } from '@/types';

import { ContactListPageQuery, ContactType } from 'generated/graphql-types';

type QueryContactGroup = ArrayElement<
  NonNullable<ContactListPageQuery['contactGroups']>
>;

type QueryContact = ArrayElement<NonNullable<QueryContactGroup>['contacts']>;

type Props = {
  contact: QueryContact;
  onClick: () => void;
};

const ListItem = (props: Props) => {
  const { contact, onClick } = props;

  return (
    <div className={styles['list-item']} onClick={onClick}>
      <Grid.Row justify="space-between">
        <Typography.Text className={styles.title}>
          {contact?.name}
        </Typography.Text>

        <Typography.Text>
          {dayjs(contact?.createdAt).format('D MMM YYYY')}
        </Typography.Text>
      </Grid.Row>

      <Typography.Text className={styles.subtitle}>
        {contact?.type === ContactType.Individual ? 'Personal' : 'Company'}
      </Typography.Text>

      <Grid.Row justify="space-between" align="center">
        <Space>
          <MdOutlinePeople className={styles['footer-icon']} />

          <Typography.Text>{contact?.pics?.length}</Typography.Text>
        </Space>

        <Avatar
          size={20}
          name={contact?.dealCreator?.name || contact?.dealCreator?.email}
          imageSrc={contact?.dealCreator?.profileImage}
        />
      </Grid.Row>
    </div>
  );
};

export default ListItem;
