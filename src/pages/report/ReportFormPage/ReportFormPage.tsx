import { gql, useQuery } from '@apollo/client';
import { Card, Typography, Grid, Spin } from '@arco-design/web-react';
import type { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { uniqBy } from 'lodash-es';
import { useNavigate } from 'react-router-dom';

import { ContentHeader } from '@/components';
import Modal from '@/components/Modal';

import ReportForm, { FormValues } from './ReportForm';
import styles from './ReportFormPage.module.less';

import { useAppStore } from '@/stores/useAppStore';
import { useResponsiveStore } from '@/stores/useResponsiveStores';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { alphabeticalSort } from '@/utils/sorter.utils';

import {
  navigateCompanySubscriptionsPage,
  navigateGenerateReportPage,
} from '@/navigation';

import { SelectOption } from '@/types';

import {
  TaskBoardType,
  CompanyMemberType,
  ReportFormPageQuery,
  ReportFormPageQueryVariables,
} from 'generated/graphql-types';

const ReportFormPage = () => {
  const navigate = useNavigate();

  const { activeCompany, getCurrentMember } = useAppStore();
  const { getWorkspaceOptions } = useWorkspaceStore();
  const { isMobile } = useResponsiveStore();

  const { data: queryData, loading: queryLoading } = useQuery<
    ReportFormPageQuery,
    ReportFormPageQueryVariables
  >(reportFormPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
      type: TaskBoardType.All,
    },
  });

  const handleGenerateReport = (values: FormValues) => {
    if (activeCompany?.currentSubscription?.reportQuota === 0) {
      const currentMember = getCurrentMember();

      Modal.info({
        title: 'Reached Plan Limit',
        content:
          currentMember?.type === CompanyMemberType.Admin
            ? 'You have reached your quota for number of reports, please upgrade your plan'
            : 'You have reached your quota for number of reports, please upgrade your plan or contact your admin',
        okText:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });
    } else {
      navigateGenerateReportPage({
        navigate,
        companySlug: activeCompany?.slug as string,
        state: values,
      });
    }
  };

  const getCompanyMemberOptions = (): SelectOption[] => {
    if (!queryData?.company?.members) {
      return [];
    }

    return queryData.company.members
      .map((member) => ({
        label: member?.user?.name || member?.user?.email,
        value: member?.id as string,
        extra: {
          name: member?.user?.name,
          email: member?.user?.email,
        },
      }))
      .sort(alphabeticalSort('label'));
  };

  const getContactOptions = (): SelectOption[] => {
    if (!queryData?.contacts) {
      return [];
    }

    return queryData.contacts
      .map((contact) => ({
        label: contact?.name,
        value: contact?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getTagGroupTreeData = (): TreeDataType[] => {
    if (!queryData?.tagGroups) {
      return [];
    }

    return queryData.tagGroups.map((group) => ({
      id: group?.id,
      title: group?.name,
      selectable: false,
      children: group?.tags?.map((tag) => ({
        id: tag?.id,
        title: tag?.name,
      })),
    }));
  };

  const getAttendanceLabelOptions = (): SelectOption[] => {
    if (!queryData?.attendanceLabels) {
      return [];
    }

    return queryData.attendanceLabels
      .map((label) => ({
        label: label?.name,
        value: label?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getEmployeeTypeOptions = (): SelectOption[] => {
    if (!queryData?.company?.employeeTypes) {
      return [];
    }

    return queryData.company.employeeTypes
      .filter((type) => !type?.archived)
      .map((type) => ({
        label: type?.name,
        value: type?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getProjectOptions = (): SelectOption[] => {
    if (!queryData?.taskBoards) {
      return [];
    }

    return queryData.taskBoards
      .map((board) => ({
        label: board?.name,
        value: board?.id as string,
      }))
      .sort(alphabeticalSort('label'));
  };

  const getCompanyTeamOptions = (): SelectOption[] => {
    if (!queryData?.company?.teams) {
      return [];
    }

    return queryData.company.teams.map((team) => {
      return {
        label: team?.title,
        value: team?.id as string,
      };
    });
  };

  const getProjectOwnerOptions = (): SelectOption[] => {
    if (!queryData?.taskBoards) {
      return [];
    }

    const owners = queryData.taskBoards.reduce<SelectOption[]>(
      (prev, board) => {
        const owners: SelectOption[] =
          board?.owners?.map((owner) => ({
            label:
              owner?.companyMember?.user?.name ||
              owner?.companyMember?.user?.email,
            value: owner?.companyMember?.id as string,
          })) || [];

        return [...prev, ...owners];
      },
      [],
    );

    const uniqOwners = uniqBy(owners, 'value');

    return uniqOwners.sort(alphabeticalSort('label'));
  };

  const getReportTypeOptions = () => {
    const options = [
      {
        label: 'Projects, Assignee, Team',
        value: 'project',
      },
      {
        label: 'Time Attendance',
        value: 'attendance',
      },
      {
        label: 'Invoice',
        value: 'invoice',
      },
    ];

    return options;
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Report',
          },
        ]}
      />

      <Spin style={{ display: 'block' }} loading={queryLoading}>
        <Card className={styles.wrapper}>
          <Typography.Text className={styles.title}>Report</Typography.Text>

          <Grid.Row justify="center">
            <Grid.Col span={isMobile ? 24 : 16}>
              <ReportForm
                reportTypeOptions={getReportTypeOptions()}
                companyMemberOptions={getCompanyMemberOptions()}
                contactOptions={getContactOptions()}
                tagGroupTreeData={getTagGroupTreeData()}
                attendanceLabelOptions={getAttendanceLabelOptions()}
                employeeTypeOptions={getEmployeeTypeOptions()}
                projectOptions={getProjectOptions()}
                projectOwnerOptions={getProjectOwnerOptions()}
                workspaceOptions={getWorkspaceOptions()}
                companyTeamOptions={getCompanyTeamOptions()}
                onSubmit={handleGenerateReport}
              />
            </Grid.Col>
          </Grid.Row>
        </Card>
      </Spin>
    </>
  );
};

const reportFormPageQuery = gql`
  query ReportFormPage($companyId: ID!, $type: TaskBoardType!) {
    company(id: $companyId) {
      id
      teams {
        id
        title
      }
      members {
        id
        user {
          id
          email
          name
        }
      }
      employeeTypes {
        id
        name
        archived
      }
    }
    contacts(companyId: $companyId) {
      id
      name
    }
    tagGroups(companyId: $companyId) {
      id
      name
      tags {
        id
        name
      }
    }
    attendanceLabels(companyId: $companyId) {
      id
      name
    }
    taskBoards(companyId: $companyId, type: $type) {
      id
      name
      owners {
        companyMember {
          id
          user {
            id
            email
            name
          }
        }
      }
    }
  }
`;

export default ReportFormPage;
