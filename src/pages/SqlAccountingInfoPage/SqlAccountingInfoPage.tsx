import { gql, useMutation, useQuery } from '@apollo/client';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import SettingsForm, { FormValues } from './SettingsForm';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import {
  SqlAccountingInfoPageQuery,
  SqlAccountingInfoPageQueryVariables,
  UpdateCompanyInfoMutation,
  UpdateCompanyInfoMutationVariables,
} from 'generated/graphql-types';

const SqlAccountingInfoPage = () => {
  const { activeCompany } = useAppStore();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<SqlAccountingInfoPageQuery, SqlAccountingInfoPageQueryVariables>(
    sqlAccountingInfoPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateUpdateCompanyInfo, { loading: mutateUpdateCompanyInfoLoading }] =
    useMutation<UpdateCompanyInfoMutation, UpdateCompanyInfoMutationVariables>(
      updateCompanyInfoMutation,
    );

  const handleUpdateCompanyInfo = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateUpdateCompanyInfo({
        variables: {
          companyId: activeCompany.id,
          input: {
            accountCode: values.code.trim(),
          },
        },
      });

      if (!res.errors) {
        Message.success('Successfully updated the code.');

        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update code.',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Integration',
            path: '/settings/integrations',
          },
          {
            name: 'SQL Accounting',
          },
        ]}
      />

      <div className="mt-2 bg-white p-4">
        <SettingsForm
          company={queryData?.company}
          queryLoading={queryLoading}
          loading={mutateUpdateCompanyInfoLoading}
          onSubmit={handleUpdateCompanyInfo}
        />
      </div>
    </>
  );
};

const sqlAccountingInfoPageQuery = gql`
  query SqlAccountingInfoPage($companyId: ID!) {
    company(id: $companyId) {
      id
      accountCode
    }
  }
`;

const updateCompanyInfoMutation = gql`
  mutation UpdateCompanyInfo($companyId: ID!, $input: UpdateCompanyInfoInput!) {
    updateCompanyInfo(companyId: $companyId, input: $input) {
      id
    }
  }
`;

export default SqlAccountingInfoPage;
