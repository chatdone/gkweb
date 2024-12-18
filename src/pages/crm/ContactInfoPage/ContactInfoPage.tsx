import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Space,
  Card,
  Tabs,
  Descriptions,
  DescriptionsProps,
  Select,
  Grid,
  Skeleton,
  Typography,
  Button,
  SelectProps,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { range, groupBy } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import {
  MdDelete,
  MdDirectionsRun,
  MdNoteAlt,
  MdOutlineFileCopy,
  MdOutlinePeopleOutline,
  MdTaskAlt,
} from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentHeader, Avatar, CompanyTagInput } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import ActivityPanel, { TimelineGroup } from './ActivityPanel';
import ContactAttachmentPanel, {
  contactAttachmentPanelFragment,
} from './ContactAttachmentPanel';
import styles from './ContactInfoPage.module.less';
import ContactNotePanel, { contactNotePanelFragment } from './ContactNotePanel';
import { ContactPicPanel, contactPicPanelFragment } from './ContactPicPanel';
import ContactTaskPanel, { contactTaskPanelFragment } from './ContactTaskPanel';

import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';

import { parseContactActivity } from '@/utils/contact.utils';
import { formatToCurrency } from '@/utils/currency.utils';
import { getErrorMessage } from '@/utils/error.utils';

import { contactTypeOptions } from '@/constants/contact.constants';

import { navigateContactListPage } from '@/navigation';

import type { ArrayElement } from '@/types';

import {
  ContactType,
  TaskBoardCategory,
  TimesheetArchiveStatus,
  ContactActivityTableType,
  ContactActivityRaw,
  UpdateContactInput,
  ContactInfoPageQuery,
  ContactInfoPageQueryVariables,
  ContactActivitiesQuery,
  ContactActivitiesQueryVariables,
  UpdateContactMutation,
  UpdateContactMutationVariables,
  DeleteContactsMutation,
  DeleteContactsMutationVariables,
  AssignContactTagsMutation,
  AssignContactTagsMutationVariables,
  DeleteContactTagsMutation,
  DeleteContactTagsMutationVariables,
} from 'generated/graphql-types';

const TabPane = Tabs.TabPane;

const Row = Grid.Row;
const Col = Grid.Col;

type QueryContact = NonNullable<ContactInfoPageQuery['contact']>;
type QueryTaskBoard = ArrayElement<NonNullable<QueryContact['taskBoards']>>;
type QueryTask = ArrayElement<NonNullable<QueryTaskBoard>['tasks']>;

const ContactInfoPage = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();

  const { activeCompany } = useAppStore();
  const { isMobile } = useResponsiveStore();

  const [contactName, setContactName] = useState<string>('');
  const [contactAddress, setContactAddress] = useState<string>('');
  const [contactNote, setContactNote] = useState<string>('');
  const [contactCode, setContactCode] = useState<string>('');
  const [dealValue, setDealValue] = useState<string>('-');
  const [timelineGroups, setTimelineGroups] = useState<TimelineGroup[]>([]);
  const [contactActivitiesPagination, setContactActivitiesPagination] =
    useState<{
      limit: number;
      hasMore: boolean;
    }>({
      limit: 10,
      hasMore: true,
    });
  const previousActivitiesCount = useRef<number>(0);

  const { data: queryData, refetch: refetchQuery } = useQuery<
    ContactInfoPageQuery,
    ContactInfoPageQueryVariables
  >(contactInfoPageQuery, {
    variables: {
      contactId: contactId as string,
      companyId: activeCompany?.id as string,
      filters: {
        archived: {
          status: TimesheetArchiveStatus.False,
        },
      },
    },
    skip: !contactId || !activeCompany?.id,
  });
  const {
    data: queryContactActivities,
    loading: queryContactActivitiesLoading,
    refetch: refetchContactActivities,
  } = useQuery<ContactActivitiesQuery, ContactActivitiesQueryVariables>(
    contactActivitiesQuery,
    {
      variables: {
        contactId: contactId as string,
        isCount: false,
        tableType: ContactActivityTableType.All,
        offset: 0,
        limit: contactActivitiesPagination.limit,
      },
      skip: !contactId,
    },
  );
  const [mutateUpdateContact] = useMutation<
    UpdateContactMutation,
    UpdateContactMutationVariables
  >(updateContactMutation);
  const [mutateDeleteContacts] = useMutation<
    DeleteContactsMutation,
    DeleteContactsMutationVariables
  >(deleteContactsMutation);
  const [mutateAssignContactTags] = useMutation<
    AssignContactTagsMutation,
    AssignContactTagsMutationVariables
  >(assignContactTagsMutation);
  const [mutateDeleteContactTags] = useMutation<
    DeleteContactTagsMutation,
    DeleteContactTagsMutationVariables
  >(deleteContactTagsMutation);

  const loading = !queryData;

  useEffect(() => {
    if (queryData) {
      setContactName(queryData.contact?.name || '');
      setContactAddress(queryData.contact?.address || '');
      setContactNote(queryData.contact?.remarks || '');
      setDealValue(queryData.contact?.dealValue?.toString() || '-');
      setContactCode(queryData.contact?.accountCode || '');
    }
  }, [queryData]);

  useEffect(() => {
    if (queryContactActivities?.contactActivities) {
      const groups = groupBy(
        queryContactActivities.contactActivities,
        (activity) => dayjs(activity?.timestamp).format('YYYY-MM-DD'),
      );

      const newTimelineGroups: TimelineGroup[] = Object.entries(groups).map(
        ([key, value]) => ({
          title: key,
          children: value.map((activity) =>
            parseContactActivity(activity as ContactActivityRaw),
          ),
        }),
      );

      const hasMore =
        queryContactActivities.contactActivities.length !==
        previousActivitiesCount.current;

      previousActivitiesCount.current =
        queryContactActivities.contactActivities.length;

      setTimelineGroups(newTimelineGroups);
      setContactActivitiesPagination((prev) => ({ ...prev, hasMore }));
    }
  }, [queryContactActivities]);

  const handleOpenDeleteContactConfirmation = () => {
    Modal.confirm({
      title: 'Delete Contact',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this contact?
        </div>
      ),
      onOk: handleDeleteContact,
    });
  };

  const handleLoadMoreContactActivities = () => {
    if (
      !queryContactActivities ||
      queryContactActivitiesLoading ||
      !contactActivitiesPagination.hasMore
    ) {
      return;
    }

    setContactActivitiesPagination((prev) => ({
      ...prev,
      limit: prev.limit + 10,
    }));
  };

  const handleUpdateContact = async ({
    groupId,
    dealOwnerId,
    input,
  }: {
    groupId?: string;
    dealOwnerId?: string;
    input?: Partial<UpdateContactInput>;
  }) => {
    if (!activeCompany?.id || !contactId) {
      return;
    }

    try {
      const res = await mutateUpdateContact({
        variables: {
          companyId: activeCompany.id,
          contactId,
          dealCreator: dealOwnerId,
          contactGroupId: groupId,
          input: {
            name: input?.name || (queryData?.contact?.name as string),
            type: queryData?.contact?.type as ContactType,
            ...input,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        refetchContactActivities();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update contact',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddContactTag = async (tagId: string) => {
    if (!contactId) {
      return;
    }

    try {
      const res = await mutateAssignContactTags({
        variables: {
          input: {
            contactId,
            tagIds: [tagId],
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add tag',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContactTag = async (tagId: string) => {
    if (!contactId) {
      return;
    }

    try {
      const res = await mutateDeleteContactTags({
        variables: {
          input: {
            contactId,
            tagIds: [tagId],
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete tag',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContact = async () => {
    if (!activeCompany?.id || !activeCompany.slug || !contactId) {
      return;
    }

    try {
      const res = await mutateDeleteContacts({
        variables: {
          companyId: activeCompany.id,
          contactIds: [contactId],
        },
      });

      if (!res.errors) {
        navigateContactListPage(navigate, activeCompany.slug);
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete contact',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCompanyMemberOptions = (): SelectProps['options'] => {
    if (!activeCompany?.members) {
      return [];
    }

    return activeCompany.members.map((member) => ({
      label: member?.user?.name || member?.user?.email,
      value: member?.user?.id as string,
    }));
  };

  const getContactGroupOptions = (): SelectProps['options'] => {
    if (!queryData?.contactGroups || !queryData.contact?.groups) {
      return [];
    }

    return queryData.contactGroups.map((group) => ({
      label: group?.name,
      value: group?.id as string,
    }));
  };

  const getContactTasks = (type: TaskBoardCategory) => {
    if (!queryData?.contact?.taskBoards) {
      return [];
    }

    const boards = queryData.contact.taskBoards.filter(
      (board) => board?.category === type,
    );

    const tasks = boards.reduce<QueryTask[]>(
      (prev, current) => [...prev, ...(current?.tasks || [])],
      [],
    );

    return tasks;
  };

  const tabs = [
    {
      title: (
        <span>
          <MdOutlinePeopleOutline /> Contact Person
        </span>
      ),
      content: (
        <ContactPicPanel
          contactId={contactId as string}
          pics={queryData?.contact?.pics}
          refetchQuery={refetchQuery}
        />
      ),
    },
    {
      title: (
        <span>
          <MdDirectionsRun /> Activity
        </span>
      ),
      content: (
        <ActivityPanel
          groups={timelineGroups}
          hasMore={contactActivitiesPagination.hasMore}
          onReachEnd={handleLoadMoreContactActivities}
        />
      ),
    },
    {
      title: (
        <span>
          <MdNoteAlt /> Notes
        </span>
      ),
      content: (
        <ContactNotePanel
          contactId={contactId as string}
          contactNotes={queryData?.contact?.notes}
          refetchQuery={refetchQuery}
        />
      ),
    },
    {
      title: (
        <span>
          <MdTaskAlt /> Tasks
        </span>
      ),
      content: (
        <ContactTaskPanel
          contactTasks={getContactTasks(TaskBoardCategory.Default)}
        />
      ),
    },
    {
      title: (
        <span>
          <MdOutlineFileCopy /> Attachment
        </span>
      ),
      content: (
        <ContactAttachmentPanel
          contactTaskBoards={queryData?.contact?.taskBoards}
          refetchQuery={refetchQuery}
        />
      ),
    },
  ];

  const leftDescription: DescriptionsProps['data'] = [
    {
      label: 'Contact Name',
      value: loading ? (
        <Skeleton text={{ rows: 1 }} animation />
      ) : (
        <Typography.Text
          editable={{
            onChange: (text: string) => {
              setContactName(text);
            },
            onEnd: (text: string) => {
              handleUpdateContact({
                input: {
                  name: text,
                },
              });
            },
          }}
        >
          {contactName}
        </Typography.Text>
      ),
    },
    {
      label: 'Group',
      value: (
        <ContactDescriptionSelect
          loading={loading}
          value={queryData?.contact?.groups?.[0]?.id || 'unassigned'}
          options={getContactGroupOptions()}
          onChange={(value) => handleUpdateContact({ groupId: value })}
        />
      ),
    },
    {
      label: 'Type',
      value: (
        <ContactDescriptionSelect
          loading={loading}
          value={queryData?.contact?.type || undefined}
          options={contactTypeOptions}
          onChange={(value: ContactType) =>
            handleUpdateContact({ input: { type: value } })
          }
        />
      ),
    },
    {
      label: 'Address',
      value: loading ? (
        <Skeleton text={{ rows: 1 }} animation />
      ) : (
        <Typography.Text
          editable={{
            onChange: (text: string) => {
              setContactAddress(text);
            },
            onEnd: (text: string) => {
              handleUpdateContact({
                input: {
                  address: text,
                },
              });
            },
          }}
        >
          {contactAddress}
        </Typography.Text>
      ),
    },
    {
      label: 'Account Code',
      value: loading ? (
        <Skeleton text={{ rows: 1 }} animation />
      ) : (
        <Typography.Text
          editable={{
            onChange: (text: string) => {
              setContactCode(text);
            },
            onEnd: (text: string) => {
              handleUpdateContact({
                input: {
                  accountCode: text,
                },
              });
            },
          }}
        >
          {contactCode}
        </Typography.Text>
      ),
    },
  ];

  const rightDescription: DescriptionsProps['data'] = [
    {
      label: 'Deal Owner',
      value: (
        <ContactDescriptionSelect
          loading={loading}
          options={getCompanyMemberOptions()}
          value={queryData?.contact?.dealCreator?.id || undefined}
          onChange={(value: string) =>
            handleUpdateContact({ dealOwnerId: value })
          }
        />
      ),
    },
    {
      label: 'Deal Value',
      value: loading ? (
        <Skeleton text={{ rows: 2 }} animation />
      ) : (
        <Typography.Text
          editable={{
            onChange: (value: string) => {
              setDealValue(value);
            },
            onEnd: (value: string) => {
              handleUpdateContact({
                input: {
                  deal_value: +value,
                },
              });
            },
          }}
        >
          {formatToCurrency(+dealValue)}
        </Typography.Text>
      ),
    },
    {
      label: 'Tag',
      value: (
        <Skeleton text={{ rows: 1 }} animation loading={loading}>
          <CompanyTagInput
            value={
              queryData?.contact?.tags?.map((tag) => tag?.id as string) || []
            }
            tagGroups={queryData?.tagGroups}
            onAdd={(value) => handleAddContactTag(value)}
            onRemove={(value) => handleDeleteContactTag(value)}
          />
        </Skeleton>
      ),
    },
    {
      label: 'Notes',
      value: loading ? (
        <Skeleton text={{ rows: 2 }} animation />
      ) : (
        <Typography.Text
          editable={{
            onChange: (text: string) => {
              setContactNote(text);
            },
            onEnd: (text: string) => {
              handleUpdateContact({
                input: {
                  remarks: text,
                },
              });
            },
          }}
        >
          {contactNote}
        </Typography.Text>
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Contacts',
            path: '/contacts',
          },
          {
            name: queryData?.contact?.name || '-',
          },
        ]}
        rightElement={
          !isMobile && (
            <Space size="large">
              <Typography.Text>{`Created Date : ${
                queryData?.contact?.createdAt
                  ? dayjs(queryData.contact.createdAt).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )
                  : '-'
              }`}</Typography.Text>

              <Button
                className={styles['delete-button']}
                icon={<MdDelete />}
                onClick={handleOpenDeleteContactConfirmation}
              >
                Delete
              </Button>
            </Space>
          )
        }
      />

      <Space className={styles['space-wrapper']} direction="vertical" size={10}>
        <Card className={`${styles.card} ${styles['info-card']}`}>
          {isMobile && (
            <Typography.Paragraph className={styles['card-title']}>
              Contact
            </Typography.Paragraph>
          )}

          <Row align="stretch">
            <Col xs={24} md={3}>
              <Skeleton
                animation
                loading={loading}
                text={false}
                image={{
                  shape: 'circle',
                  size: 'large',
                  style: { width: 100, height: 100 },
                }}
              >
                <Avatar size={100} name={queryData?.contact?.name as string} />
              </Skeleton>
            </Col>

            {isMobile ? (
              <Descriptions
                className={styles['contact-descriptions']}
                colon=" :"
                column={1}
                data={[...leftDescription, ...rightDescription]}
              />
            ) : (
              <>
                <Col md={6}>
                  <Descriptions
                    className={styles['contact-descriptions']}
                    colon=" :"
                    column={1}
                    data={leftDescription}
                  />
                </Col>

                <Col md={{ span: 10, offset: 3 }}>
                  <Descriptions
                    className={styles['contact-descriptions']}
                    colon=" :"
                    column={1}
                    data={rightDescription}
                  />
                </Col>
              </>
            )}
          </Row>
        </Card>

        <Card className={`${styles.card} ${styles.tabs}`}>
          {loading ? (
            <TabLoadingPanel />
          ) : (
            <Tabs>
              {tabs.map((tab, index) => (
                <TabPane key={index} title={tab.title}>
                  {tab.content}
                </TabPane>
              ))}
            </Tabs>
          )}
        </Card>
      </Space>
    </>
  );
};

const TabLoadingPanel = () => {
  const GridSkeleton = () => (
    <Col xs={24} sm={12} md={8} xl={6}>
      <Skeleton animation text={false} image={{}} />
    </Col>
  );

  return (
    <Space className={styles['loading-panel']} direction="vertical" size={25}>
      <Space className={styles['loading-tabs']} size={20}>
        <Skeleton text={{ rows: 1, width: 124 }} animation />
        <Skeleton text={{ rows: 1, width: 87 }} animation />
        <Skeleton text={{ rows: 1, width: 68 }} animation />
        <Skeleton text={{ rows: 1, width: 68 }} animation />
        <Skeleton text={{ rows: 1, width: 68 }} animation />
        <Skeleton text={{ rows: 1, width: 98 }} animation />
        <Skeleton text={{ rows: 1, width: 98 }} animation />
        <Skeleton text={{ rows: 1, width: 98 }} animation />
      </Space>

      <Skeleton
        className={styles['search-input-skeleton']}
        animation
        text={{ rows: 1, width: '22%' }}
      />

      <Row
        className={styles['skeleton-grid']}
        gutter={{ sm: 12, md: 16, xl: 25 }}
        align="stretch"
      >
        {range(0, 8).map((_, index) => (
          <GridSkeleton key={index} />
        ))}
      </Row>
    </Space>
  );
};

const ContactDescriptionSelect = ({
  loading,
  options,
  value,
  onChange,
}: {
  loading: boolean;
  options: SelectProps['options'];
  value?: SelectProps['value'];
  onChange?: SelectProps['onChange'];
}) => {
  return loading ? (
    <Skeleton text={{ rows: 1 }} animation />
  ) : (
    <Select value={value} options={options} onChange={onChange} />
  );
};

const contactInfoPageQuery = gql`
  query ContactInfoPage(
    $contactId: ID!
    $companyId: ID!
    $filters: FilterOptions
  ) {
    contact(id: $contactId) {
      id
      name
      address
      remarks
      type
      dealValue
      createdAt
      accountCode
      dealCreator {
        id
      }
      groups {
        id
      }
      tags {
        id
      }
      pics {
        ...ContactPicPanelFragment
      }
      taskBoards {
        id
        category
        tasks(filters: $filters) {
          ...ContactTaskPanelFragment
          ...ContactAttachmentPanelFragment
        }
      }
      notes {
        ...ContactNotePanelFragment
      }
    }
    tagGroups(companyId: $companyId) {
      id
      name
      tags {
        id
        name
        color
      }
    }
    contactGroups(companyId: $companyId) {
      id
      name
    }
  }
  ${contactPicPanelFragment}
  ${contactNotePanelFragment}
  ${contactTaskPanelFragment}
  ${contactAttachmentPanelFragment}
`;

const contactActivitiesQuery = gql`
  query ContactActivities(
    $contactId: ID!
    $tableType: ContactActivityTableType!
    $limit: Int!
    $isCount: Boolean!
    $offset: Int!
  ) {
    contactActivities(
      contactId: $contactId
      tableType: $tableType
      limit: $limit
      isCount: $isCount
      offset: $offset
    ) {
      action
      timestamp
      previousValues
      currentValues
      changedValues
    }
  }
`;

const updateContactMutation = gql`
  mutation UpdateContact(
    $companyId: ID!
    $contactId: ID!
    $input: UpdateContactInput!
    $contactGroupId: ID
    $dealCreator: ID
  ) {
    updateContact(
      companyId: $companyId
      contactId: $contactId
      input: $input
      contactGroupId: $contactGroupId
      dealCreator: $dealCreator
    ) {
      id
    }
  }
`;

const deleteContactsMutation = gql`
  mutation DeleteContacts($companyId: ID!, $contactIds: [ID]!) {
    deleteContacts(companyId: $companyId, contactIds: $contactIds) {
      id
    }
  }
`;

const assignContactTagsMutation = gql`
  mutation AssignContactTags($input: ContactTagOptions!) {
    assignContactTags(input: $input) {
      tag {
        id
      }
    }
  }
`;

const deleteContactTagsMutation = gql`
  mutation DeleteContactTags($input: ContactTagOptions!) {
    deleteContactTags(input: $input) {
      tag {
        id
      }
    }
  }
`;

export default ContactInfoPage;
