import {
  Button,
  Grid,
  Input,
  List,
  Modal,
  Space,
  Typography,
  Tag,
} from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';

import { Avatar } from '@/components';

import styles from './RemoveWhitelistedMemberModal.module.less';

import { ArrayElement, BaseModalConfig } from '@/types';

import { CompanySubscriptionInfoPageQuery } from 'generated/graphql-types';

type QueryWhitelistedCompanyMember = ArrayElement<
  NonNullable<
    NonNullable<
      NonNullable<
        CompanySubscriptionInfoPageQuery['companySubscription']
      >['whiteListedMembers']
    >['companyMembers']
  >
>;

type Props = BaseModalConfig & {
  quantity: number;
  whitelistedMembers: NonNullable<
    CompanySubscriptionInfoPageQuery['companySubscription']
  >['whiteListedMembers'];
  onRemove: (member: QueryWhitelistedCompanyMember) => void;
};

const RemoveWhitelistedMemberModal = (props: Props) => {
  const { visible, onCancel, quantity, whitelistedMembers, onRemove } = props;

  const [members, setMembers] =
    useState<NonNullable<Props['whitelistedMembers']>['companyMembers']>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [removingMemberIds, setRemovingMemberIds] = useState<string[]>([]);
  const [removedMemberIds, setRemovedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setMembers(whitelistedMembers?.companyMembers);
      setSearchKeyword('');
      setRemovingMemberIds([]);
      setRemovedMemberIds([]);
    }
  }, [visible]);

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleRemoveMember = async (member: QueryWhitelistedCompanyMember) => {
    if (!member?.id) {
      return;
    }

    setRemovingMemberIds((prev) => [...prev, member.id]);

    await onRemove(member);

    setRemovingMemberIds((prev) => prev.filter((id) => id !== member.id));
    setRemovedMemberIds((prev) => [...prev, member.id]);
  };

  const handleProceed = () => {
    const assigned = whitelistedMembers?.assigned || 0;
    if (assigned > quantity) {
      return;
    }

    onCancel();
  };

  const getVisibleMembers = () => {
    if (!members) {
      return [];
    }

    let visibleMembers = members;

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, 'i');

      visibleMembers = visibleMembers.filter(
        (member) =>
          member?.user?.name?.match(regex) || member?.user?.email?.match(regex),
      );
    }

    return visibleMembers;
  };

  return (
    <Modal
      className={styles.modal}
      visible={visible}
      title={`Remove member from whitelist ${whitelistedMembers?.assigned}/${quantity}`}
      okText="Done"
      onOk={handleProceed}
      onCancel={onCancel}
    >
      {(whitelistedMembers?.assigned || 0) > quantity && (
        <Typography.Paragraph className={styles['warning-txt']}>
          Remove {(whitelistedMembers?.assigned as number) - quantity} members
          to continue
        </Typography.Paragraph>
      )}

      <Input
        placeholder="Search member by email/name"
        suffix={<MdSearch />}
        value={searchKeyword}
        onChange={handleUpdateSearchKeyword}
      />

      <List
        className={styles.list}
        bordered={false}
        dataSource={getVisibleMembers()}
        render={(item) => {
          const isRemoved = !!item?.id && removedMemberIds.includes(item.id);
          const isLoading = !!item?.id && removingMemberIds.includes(item.id);

          return (
            <List.Item key={item?.id}>
              <Grid.Row
                className={styles.member}
                justify="space-between"
                align="center"
              >
                <Space size={20}>
                  <Avatar
                    size={32}
                    imageSrc={item?.user?.profileImage}
                    name={item?.user?.name || item?.user?.email}
                  />

                  <div>
                    <Typography.Paragraph className={styles.name}>
                      {item?.user?.name || '-'}
                    </Typography.Paragraph>

                    <Typography.Paragraph className={styles.email}>
                      {item?.user?.email}
                    </Typography.Paragraph>
                  </div>
                </Space>

                {isRemoved ? (
                  <Tag>Removed</Tag>
                ) : (
                  <Button
                    type="text"
                    icon={<MdClose />}
                    loading={isLoading}
                    onClick={() => handleRemoveMember(item)}
                  />
                )}
              </Grid.Row>
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};

export default RemoveWhitelistedMemberModal;
