import { gql, useMutation } from '@apollo/client';
import { Button, Grid, Space, Table } from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useState } from 'react';
import { MdCheck, MdClose, MdOutlineAdd } from 'react-icons/md';

import Message from '@/components/Message';

import { QueryCompanyMember } from '../AttendanceListPage';
import ApprovalModal from './ApprovalModal';
import styles from './ApprovalTab.module.less';
import NewApprovalModal, {
  FormValues as NewApprovalFormValues,
} from './NewApprovalModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { ApolloClient } from '@/services';

import { formatToCurrency } from '@/utils/currency.utils';
import { getErrorMessage } from '@/utils/error.utils';
import { alphabeticalSort, countSort } from '@/utils/sorter.utils';

import { companyMemberFragment } from '@/fragments';

import { SelectOption } from '@/types';

import {
  CompanyMemberType,
  CompanyMemberReferenceImageStatus,
  AttendanceListPageQuery,
  GetReferenceImageUploadUrlQuery,
  GetReferenceImageUploadUrlQueryVariables,
  CompanyMemberSetReferenceImageMutation,
  CompanyMemberSetReferenceImageMutationVariables,
  SetCompanyMemberReferenceImageStatusMutation,
  SetCompanyMemberReferenceImageStatusMutationVariables,
} from 'generated/graphql-types';

type Props = {
  companyMembers: NonNullable<AttendanceListPageQuery['company']>['members'];
  refetchQuery: () => void;
};
const ApprovalTab = (props: Props) => {
  const { companyMembers, refetchQuery } = props;

  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const [
    mutateSetCompanyMemberReferenceImageStatus,
    { loading: mutateSetCompanyMemberReferenceImageStatusLoading },
  ] = useMutation<
    SetCompanyMemberReferenceImageStatusMutation,
    SetCompanyMemberReferenceImageStatusMutationVariables
  >(setCompanyMemberReferenceImageStatusMutation);
  const [mutateSetCompanyMemberReferenceImage] = useMutation<
    CompanyMemberSetReferenceImageMutation,
    CompanyMemberSetReferenceImageMutationVariables
  >(setCompanyMemberReferenceImageMutation);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [approvalCompanyMember, setApprovalCompanyMember] =
    useState<QueryCompanyMember>();
  const [newApprovalLoading, setNewApprovalLoading] = useState<boolean>(false);

  const modalState = {
    approval: useDisclosure(),
    newApproval: useDisclosure(),
  };

  const canApprove = currentMember?.type === CompanyMemberType.Admin;

  const handleClickRow = (companyMember: QueryCompanyMember) => {
    if (!canApprove) {
      return;
    }

    setApprovalCompanyMember(companyMember);

    modalState.approval.onOpen();
  };

  const handleUpdateAllReferenceImageStatuses = (
    status: CompanyMemberReferenceImageStatus,
  ) => {
    const pendingMembers = getPendingApprovalCompanyMembers();

    handleUpdateReferenceImageStatus({
      companyMemberIds: pendingMembers.map((member) => member?.id as string),
      status,
    });
  };

  const handleUpdateReferenceImageStatus = async (
    input: Omit<
      SetCompanyMemberReferenceImageStatusMutationVariables,
      'companyId'
    >,
  ) => {
    if (input.companyMemberIds && input.companyMemberIds.length === 0) {
      return;
    }

    try {
      const res = await mutateSetCompanyMemberReferenceImageStatus({
        variables: {
          companyId: activeCompany?.id as string,
          ...input,
        },
      });

      if (!res.errors) {
        refetchQuery();

        modalState.approval.onClose();
      } else {
        Message.error(
          `Failed to ${
            input.status === CompanyMemberReferenceImageStatus.Approved
              ? 'approve'
              : 'reject'
          } reference image`,
          {
            title: getErrorMessage(res.errors),
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitNewApproval = async (values: NewApprovalFormValues) => {
    setNewApprovalLoading(true);

    try {
      const { data } = await ApolloClient.query<
        GetReferenceImageUploadUrlQuery,
        GetReferenceImageUploadUrlQueryVariables
      >({
        query: getReferenceImageUploadUrlQuery,
        variables: {
          companyId: activeCompany?.id as string,
        },
      });

      const uriParts = data.getReferenceImageUploadUrl?.uploadUrl?.split('?');

      const options = {
        method: 'PUT',
        body: values.uploadItems[0].originFile,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      // Upload reference image
      await fetch(
        data.getReferenceImageUploadUrl?.uploadUrl as string,
        options,
      );

      const res = await mutateSetCompanyMemberReferenceImage({
        variables: {
          companyMemberId: values.memberId,
          input: {
            image_url: uriParts?.[0] as string,
            s3_bucket: data.getReferenceImageUploadUrl?.s3Bucket as string,
            s3_key: data.getReferenceImageUploadUrl?.s3Key as string,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        modalState.newApproval.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to upload reference image',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setNewApprovalLoading(false);
    }
  };

  const getPendingApprovalCompanyMembers = () => {
    if (!companyMembers) {
      return [];
    }

    let pendingMembers = companyMembers.filter(
      (member) =>
        member?.referenceImage?.status ===
        CompanyMemberReferenceImageStatus.PendingApproval,
    );

    if (!canApprove) {
      pendingMembers = pendingMembers.filter(
        (member) => member?.id === currentMember?.id,
      );
    }

    return pendingMembers;
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (!companyMembers) {
      return [];
    }

    return companyMembers.map((member) => ({
      label: member?.user?.name || member?.user?.email,
      value: member?.id as string,
    }));
  };

  const columns: ColumnProps<QueryCompanyMember>[] = [
    {
      title: 'Name',
      sorter: alphabeticalSort<QueryCompanyMember>(
        (item) => item?.user?.name || item?.user?.email || '',
      ),
      render: (col, item) => {
        return <Space>{item?.user?.name || item?.user?.email || ''}</Space>;
      },
    },
    {
      title: 'Employee Type',
      render: (col, item) => {
        if (!item?.employeeType) {
          return '-';
        }

        return (
          <Space>
            {item?.employeeType?.name ? item?.employeeType?.name : '-'}
          </Space>
        );
      },
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Hourly Rate',
      sorter: countSort<QueryCompanyMember>((item) => item?.hourlyRate || 0),
      render: (col, item) => {
        return item?.hourlyRate ? formatToCurrency(item.hourlyRate) : '-';
      },
    },
    {
      title: 'Action',
      width: 100,
      align: 'center',
      render: (col, item) => {
        if (!item?.id) {
          return null;
        }

        return (
          <Space>
            <Button
              icon={<MdClose />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();

                handleUpdateReferenceImageStatus({
                  status: CompanyMemberReferenceImageStatus.Rejected,
                  companyMemberIds: [item?.id],
                });
              }}
            />

            <Button
              className={styles['theme-button']}
              icon={<MdCheck />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();

                handleUpdateReferenceImageStatus({
                  status: CompanyMemberReferenceImageStatus.Approved,
                  companyMemberIds: [item?.id],
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Space className={styles.wrapper} direction="vertical" size={20}>
      <Grid.Row justify="space-between">
        <Button
          className={styles['theme-button']}
          icon={<MdOutlineAdd />}
          onClick={modalState.newApproval.onOpen}
        >
          New Approval
        </Button>

        {canApprove && (
          <Space>
            <Button
              icon={<MdClose />}
              loading={mutateSetCompanyMemberReferenceImageStatusLoading}
              onClick={() =>
                handleUpdateAllReferenceImageStatuses(
                  CompanyMemberReferenceImageStatus.Rejected,
                )
              }
            >
              Reject All
            </Button>

            <Button
              className={styles['theme-button']}
              icon={<MdCheck />}
              loading={mutateSetCompanyMemberReferenceImageStatusLoading}
              onClick={() =>
                handleUpdateAllReferenceImageStatuses(
                  CompanyMemberReferenceImageStatus.Approved,
                )
              }
            >
              Approve All
            </Button>
          </Space>
        )}
      </Grid.Row>

      <Table
        columns={canApprove ? columns : columns.slice(0, -1)}
        data={getPendingApprovalCompanyMembers()}
        border={false}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleClickRow(record),
        })}
        rowSelection={
          canApprove
            ? {
                selectedRowKeys,
                onChange: (selectedRowKeys) => {
                  setSelectedRowKeys(selectedRowKeys as string[]);
                },
              }
            : undefined
        }
      />

      <ApprovalModal
        visible={modalState.approval.visible}
        onCancel={modalState.approval.onClose}
        loading={mutateSetCompanyMemberReferenceImageStatusLoading}
        companyMember={approvalCompanyMember}
        onSubmit={(status) => {
          approvalCompanyMember?.id &&
            handleUpdateReferenceImageStatus({
              companyMemberIds: [approvalCompanyMember.id],
              status,
            });
        }}
      />

      <NewApprovalModal
        visible={modalState.newApproval.visible}
        onCancel={modalState.newApproval.onClose}
        loading={newApprovalLoading}
        companyMembers={companyMembers || []}
        companyMemberOptions={getCompanyMemberOptions()}
        onSubmit={handleSubmitNewApproval}
      />
    </Space>
  );
};

const setCompanyMemberReferenceImageStatusMutation = gql`
  mutation SetCompanyMemberReferenceImageStatus(
    $companyId: ID!
    $companyMemberIds: [ID]!
    $status: CompanyMemberReferenceImageStatus!
    $remark: String
  ) {
    setCompanyMemberReferenceImageStatus(
      companyId: $companyId
      companyMemberIds: $companyMemberIds
      status: $status
      remark: $remark
    ) {
      ...CompanyMemberFragment
    }
  }
  ${companyMemberFragment}
`;

const setCompanyMemberReferenceImageMutation = gql`
  mutation CompanyMemberSetReferenceImage(
    $companyMemberId: ID!
    $input: UploadMemberReferenceImageInput!
  ) {
    setCompanyMemberReferenceImage(
      companyMemberId: $companyMemberId
      input: $input
    ) {
      ...CompanyMemberFragment
    }
  }
  ${companyMemberFragment}
`;

const getReferenceImageUploadUrlQuery = gql`
  query GetReferenceImageUploadUrl($companyId: ID!) {
    getReferenceImageUploadUrl(companyId: $companyId) {
      s3Bucket
      s3Key
      uploadUrl
    }
  }
`;

export default ApprovalTab;
