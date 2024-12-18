import { gql } from '@apollo/client';
import {
  Button,
  Grid,
  Modal,
  Select,
  Space,
  Typography,
} from '@arco-design/web-react';
import { ReactNode, useEffect, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';

import { Avatar } from '@/components';

import styles from './AddMemberModal.module.less';

import type { BaseModalConfig, SelectOption } from '@/types';

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit?: (memberIds: string[]) => void;
  companyMemberOptions: SelectOption[];
  nameExtra?: (option: SelectOption) => ReactNode;
};

export const addMemberModalFragment = gql`
  fragment AddMemberModalFragment on CompanyMember {
    id
    hourlyRate
    user {
      id
      email
      name
      profileImage
    }
  }
`;

const AddMemberModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    onSubmit,
    companyMemberOptions,
    nameExtra,
  } = props;

  const [selectedMemberIds, setSelectedMember] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setSelectedMember([]);
    }
  }, [visible]);

  const handleAddMemberId = (value: string) => {
    if (!selectedMemberIds.includes(value)) {
      setSelectedMember((prev) => [...prev, value]);
    }
  };

  const handleRemoveMember = (value: string) => {
    setSelectedMember((prev) =>
      prev.filter((prevValue) => prevValue !== value),
    );
  };

  const handleSubmit = () => {
    if (selectedMemberIds.length === 0) {
      return;
    }

    if (onSubmit) {
      onSubmit(selectedMemberIds);
    }
  };

  return (
    <Modal
      title="Add Member"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      okButtonProps={{
        className: styles['save-btn'],
        disabled: selectedMemberIds.length === 0,
      }}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Space className={styles.wrapper} direction="vertical">
        <Select
          className={styles.select}
          renderFormat={() => 'Search member by email/name'}
          placeholder="Search member by email/name"
          showSearch
          suffixIcon={<MdSearch />}
          onChange={(value) => handleAddMemberId(value)}
          value=""
          options={companyMemberOptions?.filter(
            (option) =>
              typeof option === 'object' &&
              !selectedMemberIds.includes(option.value as string),
          )}
          filterOption={(inputValue, option) => {
            const regex = new RegExp(inputValue, 'i');

            return (
              option.props.extra.name?.match(regex) ||
              option.props.extra.email?.match(regex)
            );
          }}
        />

        <Space direction="vertical">
          {companyMemberOptions
            ?.filter((option) =>
              selectedMemberIds.includes(option.value as string),
            )
            .map((option) => (
              <SelectedMember
                key={option.value}
                name={option.extra.name}
                email={option.extra.email}
                imageSrc={option.extra.profileImage}
                nameExtra={nameExtra?.(option)}
                onRemove={() => handleRemoveMember(option.value as string)}
              />
            ))}
        </Space>
      </Space>
    </Modal>
  );
};

const SelectedMember = ({
  name,
  email,
  onRemove,
  imageSrc,
  nameExtra,
}: {
  name: string;
  email: string;
  onRemove: () => void;
  imageSrc?: string;
  nameExtra?: ReactNode;
}) => {
  return (
    <Grid.Row
      className={styles['selected-member']}
      justify="space-between"
      align="center"
    >
      <Space size={20}>
        <Avatar size={32} imageSrc={imageSrc} name={name || email} />

        <div>
          <Space>
            <Typography.Text className={styles.name}>
              {name || '-'}
            </Typography.Text>

            {nameExtra}
          </Space>

          <Typography.Paragraph className={styles.email}>
            {email}
          </Typography.Paragraph>
        </div>
      </Space>

      <Button type="text" icon={<MdClose />} onClick={onRemove} />
    </Grid.Row>
  );
};

export default AddMemberModal;
