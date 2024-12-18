import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Grid,
  Input,
  Space,
  Table,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { escapeRegExp } from 'lodash-es';
import { useState } from 'react';
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdFilterList,
  MdSearch,
} from 'react-icons/md';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import styles from './CompanyActivityLabelsPage.module.less';
import {
  EditCompanyActivityLabelModal,
  FormValues,
} from './EditCompanyActivityLabelModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort } from '@/utils/sorter.utils';

import type { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyActivityLabelsPageQuery,
  CompanyActivityLabelsPageQueryVariables,
  CreateAttendanceLabelMutation,
  CreateAttendanceLabelMutationVariables,
  UpdateAttendanceLabelMutation,
  UpdateAttendanceLabelMutationVariables,
  ArchiveAttendanceLabelMutation,
  ArchiveAttendanceLabelMutationVariables,
} from 'generated/graphql-types';

type QueryAttendanceLabel = ArrayElement<
  CompanyActivityLabelsPageQuery['attendanceLabels']
>;

const CompanyActivityLabelsPage = () => {
  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<
    CompanyActivityLabelsPageQuery,
    CompanyActivityLabelsPageQueryVariables
  >(companyActivityLabelsPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [
    mutateCreateAttendanceLabel,
    { loading: mutateCreateAttendanceLabelLoading },
  ] = useMutation<
    CreateAttendanceLabelMutation,
    CreateAttendanceLabelMutationVariables
  >(createAttendanceLabelMutation);
  const [
    mutateUpdateAttendanceLabel,
    { loading: mutateUpdateAttendanceLabelLoading },
  ] = useMutation<
    UpdateAttendanceLabelMutation,
    UpdateAttendanceLabelMutationVariables
  >(updateAttendanceLabelMutation);
  const [mutateArchiveAttendanceLabel] = useMutation<
    ArchiveAttendanceLabelMutation,
    ArchiveAttendanceLabelMutationVariables
  >(archiveAttendanceLabelMutation);

  const [editLabel, setEditLabel] = useState<QueryAttendanceLabel>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { onClose, onOpen, visible } = useDisclosure();

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleEditLabel = (label: QueryAttendanceLabel) => {
    setEditLabel(label);

    onOpen();
  };

  const handleCloseModal = () => {
    onClose();

    setEditLabel(undefined);
  };

  const handleOpenDeleteLabelConfirmation = (label: QueryAttendanceLabel) => {
    Modal.confirm({
      title: 'Delete Label',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this label?
        </div>
      ),
      onOk: async () => {
        await handleArchiveLabel(label);
      },
    });
  };

  const handleCreateLabel = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateAttendanceLabel({
        variables: {
          companyId: activeCompany.id,
          input: {
            name: values.name.trim(),
            description: values.description?.trim(),
            color: values.color,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create label',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateLabel = async (values: FormValues) => {
    if (!editLabel?.id) {
      return;
    }

    try {
      const res = await mutateUpdateAttendanceLabel({
        variables: {
          labelId: editLabel.id,
          input: {
            name: values.name.trim(),
            description: values.description?.trim(),
            color: values.color,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update label',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveLabel = async (label: QueryAttendanceLabel) => {
    if (!label?.id) {
      return;
    }

    try {
      const res = await mutateArchiveAttendanceLabel({
        variables: {
          labelId: label.id,
          archived: true,
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete label',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnProps<QueryAttendanceLabel>[] = [
    {
      title: 'Name',
      sorter: alphabeticalSort('name'),
      render: (col, item) => {
        return (
          <Space>
            <div
              className={styles['label-circle']}
              style={{ background: item?.color || undefined }}
            />

            <Typography.Text>{item?.name}</Typography.Text>
          </Space>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      width: 150,
      align: 'right',
      render: (col, item) => {
        return (
          <Space>
            <Button
              type="text"
              icon={<MdEdit />}
              onClick={() => handleEditLabel(item)}
            />

            <Button
              type="text"
              icon={<MdDelete />}
              onClick={() => handleOpenDeleteLabelConfirmation(item)}
            />
          </Space>
        );
      },
    },
  ];

  const getData = (): QueryAttendanceLabel[] => {
    if (!queryData?.attendanceLabels) {
      return [];
    }

    let labels = queryData.attendanceLabels.filter((label) => !label?.archived);

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      labels = labels.filter((label) => label?.name?.match(regex));
    }

    return labels;
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Time Attendance',
          },
          {
            name: 'Activity Labels',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space direction="vertical" size={20}>
          <Grid.Row justify="space-between">
            <Typography.Text className={styles.title}>
              Activity Labels
            </Typography.Text>

            <Space>
              <Input
                style={{ width: 271 }}
                suffix={<MdSearch />}
                placeholder="Search label"
                value={searchKeyword}
                onChange={handleUpdateSearchKeyword}
              />

              <Button icon={<MdFilterList />}>Filter</Button>
            </Space>
          </Grid.Row>

          {canEdit && (
            <Button
              className={styles['theme-btn']}
              icon={<MdAdd />}
              onClick={onOpen}
            >
              Add Label
            </Button>
          )}

          <Table
            columns={canEdit ? columns : columns.slice(0, -1)}
            data={getData()}
            loading={queryLoading}
            border={false}
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </Space>
      </Card>

      <EditCompanyActivityLabelModal
        visible={visible}
        onCancel={handleCloseModal}
        loading={
          mutateCreateAttendanceLabelLoading ||
          mutateUpdateAttendanceLabelLoading
        }
        activityLabel={editLabel}
        onCreate={handleCreateLabel}
        onUpdate={handleUpdateLabel}
      />
    </>
  );
};

const companyActivityLabelsPageQuery = gql`
  query CompanyActivityLabelsPage($companyId: ID!) {
    attendanceLabels(companyId: $companyId) {
      id
      name
      color
      archived
      description
    }
  }
`;

const createAttendanceLabelMutation = gql`
  mutation CreateAttendanceLabel(
    $companyId: ID!
    $input: AttendanceLabelInput!
  ) {
    createAttendanceLabel(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const updateAttendanceLabelMutation = gql`
  mutation UpdateAttendanceLabel($labelId: ID!, $input: AttendanceLabelInput!) {
    updateAttendanceLabel(labelId: $labelId, input: $input) {
      id
    }
  }
`;

const archiveAttendanceLabelMutation = gql`
  mutation ArchiveAttendanceLabel($labelId: ID!, $archived: Boolean!) {
    archiveAttendanceLabel(labelId: $labelId, archived: $archived) {
      id
    }
  }
`;

export default CompanyActivityLabelsPage;
