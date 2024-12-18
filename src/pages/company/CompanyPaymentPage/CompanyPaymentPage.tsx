import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Grid,
  Space,
  Typography,
  Spin,
} from '@arco-design/web-react';
import type { PaymentMethod as StripePaymentMethod } from '@stripe/stripe-js';
import { MdAdd, MdDownload, MdInfoOutline } from 'react-icons/md';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import AddPaymentMethodModal from './AddPaymentMethodModal';
import styles from './CompanyPaymentPage.module.less';
import PaymentHistoryTable from './PaymentHistoryTable';
import PaymentMethodCard from './PaymentMethodCard';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { downloadPaymentTransactionsReport } from '@/services/report.service';

import { getErrorMessage } from '@/utils/error.utils';

import Icons from '@/assets/icons';

import type { ArrayElement } from '@/types';

import {
  CompanyPaymentPageQuery,
  CompanyPaymentPageQueryVariables,
  CreateCompanyPaymentMethodMutation,
  CreateCompanyPaymentMethodMutationVariables,
  DeleteCompanyPaymentMethodMutation,
  DeleteCompanyPaymentMethodMutationVariables,
  SetDefaultCompanyPaymentMethodMutation,
  SetDefaultCompanyPaymentMethodMutationVariables,
} from 'generated/graphql-types';

type QueryCompanyPaymentMethod = ArrayElement<
  CompanyPaymentPageQuery['companyPaymentMethods']
>;

const { Row, Col } = Grid;

const CompanyPaymentPage = () => {
  const { activeCompany, currentUser } = useAppStore();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<CompanyPaymentPageQuery, CompanyPaymentPageQueryVariables>(
    companyPaymentPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateCreateCompanyPaymentMethod] = useMutation<
    CreateCompanyPaymentMethodMutation,
    CreateCompanyPaymentMethodMutationVariables
  >(createCompanyPaymentMethodMutation);
  const [mutateDeleteCompanyPaymentMethod] = useMutation<
    DeleteCompanyPaymentMethodMutation,
    DeleteCompanyPaymentMethodMutationVariables
  >(deleteCompanyPaymentMethodMutation);
  const [mutateSetDefaultCompanyPaymentMethod] = useMutation<
    SetDefaultCompanyPaymentMethodMutation,
    SetDefaultCompanyPaymentMethodMutationVariables
  >(setDefaultCompanyPaymentMethodMutation);

  const { visible, onClose, onOpen } = useDisclosure();

  // const handleViewInvoice = (userInvoice: QueryUserInvoice) => {
  //   userInvoice?.hosted_invoice_url &&
  //     window.open(userInvoice.hosted_invoice_url, '_blank');
  // };

  // const handleDownloadInvoice = (userInvoice: QueryUserInvoice) => {
  //   userInvoice?.invoice_pdf && window.open(userInvoice.invoice_pdf);
  // };

  const handleOpenSetDefaultCompanyPaymentMethodConfirmation = (
    paymentMethod: QueryCompanyPaymentMethod,
  ) => {
    Modal.confirm({
      title: 'Set as Default Payment Method',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to set this payment method as default?
        </div>
      ),
      onOk: async () => {
        await handleSetDefaultCompanyPaymentMethod(paymentMethod);
      },
    });
  };

  const handleOpenDeleteCompanyPaymentMethodConfirmation = (
    paymentMethod: QueryCompanyPaymentMethod,
  ) => {
    Modal.confirm({
      title: 'Remove Payment Method',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to remove this payment method?
        </div>
      ),
      onOk: async () => {
        await handleDeleteCompanyPaymentMethod(paymentMethod);
      },
    });
  };

  const handleCreateCompanyPaymentMethod = async (
    paymentMethod: StripePaymentMethod,
  ) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateCompanyPaymentMethod({
        variables: {
          input: {
            companyId: activeCompany.id,
            stripePaymentMethodId: paymentMethod.id,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to add payment method',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDefaultCompanyPaymentMethod = async (
    paymentMethod: QueryCompanyPaymentMethod,
  ) => {
    if (!activeCompany?.id || !paymentMethod?.stripePaymentMethodId) {
      return;
    }

    try {
      const res = await mutateSetDefaultCompanyPaymentMethod({
        variables: {
          input: {
            companyId: activeCompany.id,
            stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to set default company payment method',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCompanyPaymentMethod = async (
    paymentMethod: QueryCompanyPaymentMethod,
  ) => {
    if (!activeCompany?.id || !paymentMethod?.stripePaymentMethodId) {
      return;
    }

    try {
      const res = await mutateDeleteCompanyPaymentMethod({
        variables: {
          input: {
            companyId: activeCompany.id,
            stripePaymentMethodId: paymentMethod.stripePaymentMethodId,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove payment method',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    if (!currentUser?.id) {
      return;
    }

    downloadPaymentTransactionsReport(currentUser.id);
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
            name: 'Payment',
          },
        ]}
      />

      <Space className={styles.wrapper} direction="vertical">
        <Spin style={{ display: 'block' }} loading={queryLoading}>
          <Card>
            <Space direction="vertical" size={20}>
              <Button
                className={styles['theme-button']}
                icon={<MdAdd />}
                onClick={onOpen}
              >
                Add Card
              </Button>

              <Space direction="vertical">
                <Typography.Text className={styles['card-title']}>
                  Bank Cards
                </Typography.Text>

                {queryData?.companyPaymentMethods &&
                  queryData.companyPaymentMethods.length === 0 && (
                    <EmptyPaymentMethod />
                  )}

                <Row gutter={15} style={{ rowGap: 12 }}>
                  {queryData?.companyPaymentMethods?.map((method) => (
                    <Col
                      key={method?.stripePaymentMethodId}
                      xs={12}
                      sm={8}
                      xl={6}
                    >
                      <PaymentMethodCard
                        paymentMethod={method}
                        onSetDefault={() =>
                          handleOpenSetDefaultCompanyPaymentMethodConfirmation(
                            method,
                          )
                        }
                        onRemove={() =>
                          handleOpenDeleteCompanyPaymentMethodConfirmation(
                            method,
                          )
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </Space>
            </Space>
          </Card>
        </Spin>

        <Card>
          <Space direction="vertical" size={20}>
            <Row justify="space-between">
              <Typography.Text className={styles['card-title']}>
                Recent Transactions
              </Typography.Text>

              <Button icon={<MdDownload />} onClick={handleExport}>
                Export
              </Button>
            </Row>

            <PaymentHistoryTable invoices={[]} />
          </Space>
        </Card>
      </Space>

      <AddPaymentMethodModal
        visible={visible}
        onCancel={onClose}
        onSubmit={handleCreateCompanyPaymentMethod}
      />
    </>
  );
};

const EmptyPaymentMethod = () => {
  return (
    <div className={styles['empty-payment-method']}>
      <img src={Icons.emptyCard} alt="empty" />

      <Space>
        <MdInfoOutline />

        <div>
          <Typography.Paragraph className={styles.title}>
            You don't have a bank card set
          </Typography.Paragraph>
          <Typography.Paragraph>
            A subscription plan requires a valid payment option.
          </Typography.Paragraph>
        </div>
      </Space>
    </div>
  );
};

const companyPaymentPageQuery = gql`
  query CompanyPaymentPage($companyId: ID!) {
    companyPaymentMethods(companyId: $companyId) {
      isDefault
      stripePaymentMethodId
      brand
      expMonth
      expYear
      last4
    }
  }
`;

const createCompanyPaymentMethodMutation = gql`
  mutation CreateCompanyPaymentMethod(
    $input: CreateCompanyPaymentMethodInput!
  ) {
    createCompanyPaymentMethod(input: $input) {
      isDefault
    }
  }
`;

const deleteCompanyPaymentMethodMutation = gql`
  mutation DeleteCompanyPaymentMethod(
    $input: DeleteCompanyPaymentMethodInput!
  ) {
    deleteCompanyPaymentMethod(input: $input) {
      success
    }
  }
`;

const setDefaultCompanyPaymentMethodMutation = gql`
  mutation SetDefaultCompanyPaymentMethod(
    $input: SetDefaultCompanyPaymentMethodInput!
  ) {
    setDefaultCompanyPaymentMethod(input: $input) {
      isDefault
    }
  }
`;

export default CompanyPaymentPage;
