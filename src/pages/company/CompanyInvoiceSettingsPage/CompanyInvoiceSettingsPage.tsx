import { gql, useMutation, useQuery } from '@apollo/client';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import SettingsForm, { FormValues } from './SettingsForm';

import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import {
  CompanyInvoiceSettingsPageQuery,
  CompanyInvoiceSettingsPageQueryVariables,
  UpdateCompanyInfoMutation,
  UpdateCompanyInfoMutationVariables,
} from 'generated/graphql-types';

const CompanyInvoiceSettingsPage = () => {
  const { activeCompany } = useAppStore();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<
    CompanyInvoiceSettingsPageQuery,
    CompanyInvoiceSettingsPageQueryVariables
  >(companyInvoiceSettingsPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
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
            invoicePrefix: values.prefix.trim(),
            invoiceStart: values.startFrom,
          },
        },
      });

      if (!res.errors) {
        Message.success('Successfully updated the code.');

        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update',
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
            name: 'Company',
          },
          {
            name: 'Invoice',
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

const companyInvoiceSettingsPageQuery = gql`
  query CompanyInvoiceSettingsPage($companyId: ID!) {
    company(id: $companyId) {
      id
      invoicePrefix
      invoiceStart
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

export default CompanyInvoiceSettingsPage;
