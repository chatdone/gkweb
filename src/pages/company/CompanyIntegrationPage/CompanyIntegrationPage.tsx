import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Grid,
  Input,
  Space,
  Switch,
  Table,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import styles from './CompanyIntegrationPage.module.less';
import DedocoModal from './DedocoModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { LocationService } from '@/services';

import { getErrorMessage } from '@/utils/error.utils';
import { openHubspot } from '@/utils/hubspot.utils';

import {
  navigateDedocoInfoPage,
  navigateSqlAccountingInfoPage,
  navigateUserPaymentPage,
} from '@/navigation';

import Icons from '@/assets/icons';

import Configs from '@/configs';

import {
  PackageTypes,
  CompanyIntegrationPageQuery,
  CompanyIntegrationPageQueryVariables,
  RequestDedocoSubscriptionMutation,
  RequestDedocoSubscriptionMutationVariables,
} from 'generated/graphql-types';

type Integration = {
  id: string;
  name: string;
  type: string;
  usage: string;
  active: boolean;
};

const CompanyIntegrationPage = () => {
  const navigate = useNavigate();

  const { activeCompany } = useAppStore();

  const {
    data: queryData,
    loading: queryLoading,
    refetch: refetchQuery,
  } = useQuery<
    CompanyIntegrationPageQuery,
    CompanyIntegrationPageQueryVariables
  >(companyIntegrationPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [
    mutateRequestDedocoSubscription,
    { loading: mutateRequestDedocoSubscriptionLoading },
  ] = useMutation<
    RequestDedocoSubscriptionMutation,
    RequestDedocoSubscriptionMutationVariables
  >(requestDedocoSubscription);

  const [isInMalaysia, setIsInMalaysia] = useState<boolean>(true);

  const disclosureState = {
    dedoco: useDisclosure(),
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await LocationService.getIpLocation();

        if (res.data.status === 'success') {
          setIsInMalaysia(res.data.countryCode === 'MY');
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleSetupPaymentMethod = () => {
    if (!activeCompany?.slug) {
      return;
    }

    navigateUserPaymentPage(navigate, activeCompany.slug);
  };

  const handleClickRow = (integration: Integration) => {
    if (!activeCompany?.slug) {
      return;
    }

    if (integration.id === 'sql') {
      navigateSqlAccountingInfoPage({
        navigate,
        companySlug: activeCompany.slug,
      });
    } else if (integration.id === 'dedoco') {
      const dedocoSub = hasDedocoSubscription();

      if (dedocoSub) {
        navigateDedocoInfoPage(navigate, activeCompany.slug);
      } else {
        disclosureState.dedoco.onOpen();
      }
    }
  };

  const handleRequestDedocoSubscription = async (packagePriceId: string) => {
    if (!activeCompany?.id) {
      return;
    }

    const res = await mutateRequestDedocoSubscription({
      variables: {
        companyId: activeCompany?.id,
        packagePriceId: packagePriceId,
      },
    });
    if (!res.errors) {
      refetchQuery();
    } else {
      Message.error(getErrorMessage(res.errors), {
        title: 'Failed to request for dedoco subscription',
      });
    }
  };

  const getCurrentUserPaymentMethod = () => {
    if (
      !queryData?.currentUser?.paymentMethods ||
      queryData.currentUser.paymentMethods.length === 0
    ) {
      return undefined;
    }

    return queryData.currentUser.paymentMethods[0];
  };

  const hasDedocoSubscription = () => {
    if (!queryData?.company?.activeSubscription) {
      return false;
    }

    return queryData.company.activeSubscription.some(
      (sub) => sub?.type === PackageTypes.Dedoco,
    );
  };

  const hasExpiredDedocoTrialSubscription = () => {
    if (!queryData?.company?.expiredSubscription) {
      return false;
    }

    return queryData.company.expiredSubscription
      .filter((sub) => sub?.type === PackageTypes.Dedoco)
      .some((sub) => sub?.packageTitle?.match(/trial/i));
  };

  const columns: ColumnProps<Integration>[] = [
    {
      title: 'App Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Usage Feature',
      dataIndex: 'usage',
    },
    {
      title: 'Action',
      width: 150,
      align: 'center',
      render: (col, item) => {
        return (
          <Space size={20}>
            <Typography.Text>Active</Typography.Text>

            <Switch checked={item.active} />
          </Space>
        );
      },
    },
  ];

  const getIntegrations = (): Integration[] => {
    const integrations: Integration[] = [
      {
        id: 'sql',
        name: 'SQL Accounting',
        type: 'Accounting',
        usage: 'Invoicing',
        active: true,
      },
    ];

    if (Configs.env.ENABLE_DEDOCO) {
      integrations.push({
        id: 'dedoco',
        name: 'Dedoco',
        type: 'E-Signing',
        usage: 'Task, Project',
        active: hasDedocoSubscription(),
      });
    }

    return integrations;
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
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space direction="vertical" size={20}>
          <Space direction="vertical">
            <Grid.Row justify="space-between">
              <Typography.Text className={styles.title}>
                Integration
              </Typography.Text>

              <Input
                style={{ width: 306 }}
                suffix={<MdSearch />}
                placeholder="Search app"
              />
            </Grid.Row>

            <div>
              <Typography.Text>Missing something you need? </Typography.Text>

              <Typography.Text
                className={styles['text-btn']}
                underline
                onClick={openHubspot}
              >
                Request an integration
              </Typography.Text>
            </div>
          </Space>

          {Configs.env.ENABLE_DEDOCO && (
            <Space direction="vertical" size={15}>
              <Typography.Text className={styles.title}>
                Exclusive for you
              </Typography.Text>

              <Space wrap>
                <IntegrationCard
                  imgSrc={Icons.dedoco}
                  alt="Dedoco"
                  onClick={disclosureState.dedoco.onOpen}
                />
              </Space>
            </Space>
          )}

          <Space direction="vertical" size={15}>
            <Typography.Text className={styles.title}>
              Your integration
            </Typography.Text>

            <Table
              loading={queryLoading}
              data={getIntegrations()}
              columns={columns}
              border={false}
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleClickRow(record),
              })}
            />
          </Space>
        </Space>
      </Card>

      <DedocoModal
        visible={disclosureState.dedoco.visible}
        onCancel={disclosureState.dedoco.onClose}
        dedocoPackages={queryData?.dedocoPackages}
        hasSubscription={hasDedocoSubscription()}
        paymentMethod={getCurrentUserPaymentMethod()}
        onSubscribe={handleRequestDedocoSubscription}
        onSetupPaymentMethod={handleSetupPaymentMethod}
        loading={mutateRequestDedocoSubscriptionLoading}
        isInMalaysia={isInMalaysia}
        hasSubscribedTrialBefore={hasExpiredDedocoTrialSubscription()}
      />
    </>
  );
};

const IntegrationCard = ({
  imgSrc,
  alt,
  onClick,
}: {
  imgSrc: string;
  alt: string;
  onClick?: () => void;
}) => {
  return (
    <div className={styles['integration-card']} onClick={onClick}>
      <img src={imgSrc} alt={alt} />
    </div>
  );
};

const companyIntegrationPageQuery = gql`
  query CompanyIntegrationPage($companyId: ID!) {
    company(id: $companyId) {
      id
      activeSubscription {
        id
        type
      }
      expiredSubscription {
        id
        packageTitle
        type
      }
    }
    currentUser {
      id
      paymentMethods {
        id
        card {
          last4
          expMonth
          expYear
          exp_month
          exp_year
        }
      }
    }
    subscriptionPackages {
      id
      title
      type
      emailQuota
      whatsappQuota
      packagePrices {
        id
        currency
        interval
        price
      }
    }
    dedocoPackages {
      id
      title
      type
      signatureQuota
      packagePrices {
        id
        name
        price
        currency
      }
    }
  }
`;

const requestDedocoSubscription = gql`
  mutation RequestDedocoSubscription($companyId: ID!, $packagePriceId: ID!) {
    requestDedocoSubscription(
      companyId: $companyId
      packagePriceId: $packagePriceId
    ) {
      id
    }
  }
`;

export default CompanyIntegrationPage;
