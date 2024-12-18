import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Link, Radio, Spin, Tag } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { escapeRegExp, head, sortBy } from 'lodash-es';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { MdCheck } from 'react-icons/md';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import SubscriptionCard from './SubscriptionCard';

import { useAppStore } from '@/stores/useAppStore';

import {
  CURRENCY_CODE,
  formatToCurrency,
  getCurrencyCode,
} from '@/utils/currency.utils';
import { getErrorMessage } from '@/utils/error.utils';

import { ArrayElement } from '@/types';

import {
  CompanySubscriptionsPageQuery,
  CompanySubscriptionsPageQueryVariables,
  DowngradeSubscriptionMutation,
  DowngradeSubscriptionMutationVariables,
  StartSubscriptionMutation,
  StartSubscriptionMutationVariables,
  SubscriptionPriceInterval,
  UpgradeSubscriptionMutation,
  UpgradeSubscriptionMutationVariables,
  CancelSubscriptionV2Mutation,
  CancelSubscriptionV2MutationVariables,
} from 'generated/graphql-types';

type QuerySubscriptionPackage = ArrayElement<
  CompanySubscriptionsPageQuery['subscriptionPackagesV2']
>;

const CompanySubscriptionsPage = () => {
  const { activeCompany, reloadUser } = useAppStore();

  const {
    data: queryData,
    loading,
    refetch: refetchQuery,
  } = useQuery<
    CompanySubscriptionsPageQuery,
    CompanySubscriptionsPageQueryVariables
  >(companySubscriptionsPageQuery, {
    variables: {
      companyId: activeCompany?.id as string,
    },
    skip: !activeCompany?.id,
  });
  const [mutateStartSubscription, { loading: mutateStartSubscriptionLoading }] =
    useMutation<StartSubscriptionMutation, StartSubscriptionMutationVariables>(
      startSubscriptionMutation,
    );
  const [mutateUpgradeSubscription] = useMutation<
    UpgradeSubscriptionMutation,
    UpgradeSubscriptionMutationVariables
  >(upgradeSubscriptionMutation);
  const [mutateDowngradeSubscription] = useMutation<
    DowngradeSubscriptionMutation,
    DowngradeSubscriptionMutationVariables
  >(downgradeSubscriptionMutation);
  const [mutateCancelSubscription] = useMutation<
    CancelSubscriptionV2Mutation,
    CancelSubscriptionV2MutationVariables
  >(cancelSubscriptionMutation);

  const [interval, setInterval] = useState<SubscriptionPriceInterval>(
    SubscriptionPriceInterval.Year,
  );

  useEffect(() => {
    if (queryData?.company?.currentSubscription?.intervalType) {
      setInterval(queryData.company.currentSubscription.intervalType);
    }
  }, [queryData?.company]);

  const handleIntervalChange = (value: string) => {
    setInterval(value as SubscriptionPriceInterval);
  };

  const handleSelectPlanByType = (type: 'startup' | 'sme' | 'sme+') => {
    const foundPackage = queryData?.subscriptionPackagesV2?.find((subPackage) =>
      subPackage?.name?.match(new RegExp(`^${escapeRegExp(type)}$`, 'i')),
    );

    foundPackage && handleSelectPlan(foundPackage);
  };

  const handleSelectPlan = (subPackage: QuerySubscriptionPackage) => {
    const isFreePlanSelectedFreePlan =
      !queryData?.company?.currentSubscription?.stripeSubscriptionId &&
      subPackage?.id === queryData?.company?.currentSubscription?.package?.id;
    const canChangePackage =
      subPackage?.id === queryData?.company?.currentSubscription?.package?.id &&
      interval === queryData?.company?.currentSubscription?.intervalType;

    if (!subPackage || canChangePackage || isFreePlanSelectedFreePlan) {
      return;
    }

    const upcomingCancelledAction =
      queryData?.company?.currentSubscription?.upcomingChanges?.find(
        (changes) => changes?.action === 'CANCEL',
      );
    if (upcomingCancelledAction) {
      Modal.info({
        title: 'Modify Subscription',
        content: (
          <span>
            You currently have plan cancellation at{' '}
            {dayjs(upcomingCancelledAction.runAt).format('DD MMMM YYYY')}. If
            you would like to make any changes to this, please contact our
            support at{' '}
            <a
              className="cursor-pointer text-blue-500 hover:underline"
              href="mailto:support@gokudos.io"
            >
              support@gokudos.io
            </a>
          </span>
        ),
      });

      return;
    }

    if (!queryData?.company?.currentSubscription?.stripeSubscriptionId) {
      Modal.confirmV2({
        title: 'Subscribe Plan',
        content: `Are you sure you want to subscribe to ${subPackage.name} (${
          interval === SubscriptionPriceInterval.Month ? 'Monthly' : 'Yearly'
        })`,
        okText: 'Subscribe',
        onConfirm: async () => {
          await handleStartSubscription(subPackage);
        },
      });

      return;
    }

    if (subPackage.isDefault) {
      Modal.confirmV2({
        title: 'Cancel Subscription',
        content: 'Are you sure you want to cancel your subscription?',
        okText: 'Cancel Subscription',
        onConfirm: handleCancelSubscription,
      });

      return;
    }

    const upcomingDowngradeAction =
      queryData.company.currentSubscription.upcomingChanges?.find(
        (changes) => changes?.action === 'DOWNGRADE',
      );
    if (upcomingDowngradeAction) {
      Modal.info({
        title: 'Modify Subscription',
        content: (
          <span>
            You currently have a downgrade to{' '}
            {upcomingDowngradeAction.actionData.packageName} Plan at{' '}
            {dayjs(upcomingDowngradeAction.runAt).format('DD MMMM YYYY')}. If
            you would like to make any changes to this, please contact our
            support at{' '}
            <a
              className="cursor-pointer text-blue-500 hover:underline"
              href="mailto:support@gokudos.io"
            >
              support@gokudos.io
            </a>
          </span>
        ),
      });

      return;
    }

    if (interval !== queryData.company.currentSubscription.intervalType) {
      const intervalText =
        queryData.company.currentSubscription.intervalType ===
        SubscriptionPriceInterval.Month
          ? 'monthly'
          : 'yearly';
      const newInterval =
        interval === SubscriptionPriceInterval.Month ? 'monthly' : 'yearly';

      Modal.info({
        title: 'Not Supported Yet',
        content: `You are currently on a ${intervalText} plan, please contact support to change to a ${newInterval} subscription`,
      });

      return;
    }

    const isUpgrade = isUpgradePlanV2(subPackage);
    if (isUpgrade) {
      Modal.confirmV2({
        title: 'Upgrade Plan',
        content: `Are you sure you want to upgrade to ${subPackage.name} (${
          interval === SubscriptionPriceInterval.Month ? 'Monthly' : 'Yearly'
        })`,
        okText: 'Upgrade',
        onConfirm: async () => {
          await handleUpgradeSubscription(subPackage);
        },
      });
    } else {
      Modal.confirmV2({
        title: 'Downgrade Plan',
        content: `Are you sure you want to downgrade to ${subPackage.name} (${
          interval === SubscriptionPriceInterval.Month ? 'Monthly' : 'Yearly'
        })`,
        okText: 'Downgrade',
        onConfirm: async () => {
          await handleDowngradeSubscription(subPackage);
        },
      });
    }
  };

  const handleStartSubscription = async (
    subscriptionPackage: QuerySubscriptionPackage,
  ) => {
    if (!activeCompany?.id || !subscriptionPackage?.id) {
      return;
    }

    try {
      const res = await mutateStartSubscription({
        variables: {
          input: {
            companyId: activeCompany.id,
            packageId: subscriptionPackage.id,
            interval,
          },
        },
      });

      if (!res.errors) {
        Message.success(
          `Successfully subscribed to ${subscriptionPackage.name}`,
        );

        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to subscribe',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpgradeSubscription = async (
    subscriptionPackage: QuerySubscriptionPackage,
  ) => {
    if (
      !activeCompany?.id ||
      !subscriptionPackage?.id ||
      !queryData?.company?.currentSubscription?.id
    ) {
      return;
    }

    try {
      const res = await mutateUpgradeSubscription({
        variables: {
          input: {
            companyId: activeCompany.id,
            subscriptionId: queryData.company.currentSubscription.id,
            packageId: subscriptionPackage.id,
            interval,
          },
        },
      });

      if (!res.errors) {
        Message.success('Successfully upgraded plan');

        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to upgrade plan',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDowngradeSubscription = async (
    subscriptionPackage: QuerySubscriptionPackage,
  ) => {
    if (
      !activeCompany?.id ||
      !queryData?.company?.currentSubscription?.id ||
      !subscriptionPackage?.id
    ) {
      return;
    }

    try {
      const res = await mutateDowngradeSubscription({
        variables: {
          input: {
            companyId: activeCompany.id,
            interval,
            subscriptionId: queryData.company.currentSubscription.id,
            packageId: subscriptionPackage.id,
          },
        },
      });

      if (!res.errors) {
        Message.success('Successfully downgraded plan');

        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to downgrade plan',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!activeCompany?.id || !activeCompany.currentSubscription?.id) {
      return;
    }

    try {
      const res = await mutateCancelSubscription({
        variables: {
          input: {
            companyId: activeCompany.id,
            subscriptionId: activeCompany.currentSubscription.id,
          },
        },
      });

      if (!res.errors) {
        Message.success('Successfully cancelled plan');

        refetchQuery();
        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to cancel plan',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const isUpgradePlan = (selectedPackage: QuerySubscriptionPackage) => {
  //   if (
  //     interval === SubscriptionPriceInterval.Year &&
  //     queryData?.company?.currentSubscription?.intervalType ===
  //       SubscriptionPriceInterval.Month
  //   ) {
  //     return true;
  //   }

  //   if (
  //     selectedPackage?.name !==
  //     queryData?.company?.currentSubscription?.package?.name
  //   ) {
  //     if (
  //       queryData?.company?.currentSubscription?.package?.name?.match(
  //         new RegExp('startup', 'i'),
  //       )
  //     ) {
  //       return true;
  //     }

  //     if (selectedPackage?.name?.match(/^sme\+$/i)) {
  //       return true;
  //     }
  //   }

  //   return false;
  // };

  const isUpgradePlanV2 = (selectedPackage: QuerySubscriptionPackage) => {
    const currentSequence =
      queryData?.company?.currentSubscription?.package?.sequence || 0;

    const subPackageSequence = selectedPackage?.sequence || 0;

    if (currentSequence > subPackageSequence) {
      return false;
    } else if (currentSequence < subPackageSequence) {
      return true;
    }

    return false;
  };

  const getPackageTotalPrice = (subPackage: QuerySubscriptionPackage) => {
    if (!subPackage?.products) {
      return 0;
    }

    const total = subPackage.products.reduce((prev, product) => {
      const price = product?.prices?.find(
        (price) => price?.interval === interval.toLowerCase(),
      );

      return prev + (price?.amount || 0);
    }, 0);

    return total / 100;
  };

  // const getPerUserAmount = (subPackage: QuerySubscriptionPackage) => {
  //   const total =
  //     interval === SubscriptionPriceInterval.Month
  //       ? getPackageTotalPrice(subPackage)
  //       : getPackageTotalPrice(subPackage) / 12;

  //   return total / (subPackage?.userQuota || 1);

  //   if (subPackage?.name?.match(new RegExp(`^${escapeRegExp('sme')}$`, 'i'))) {
  //     return total / 25;
  //   } else if (
  //     subPackage?.name?.match(new RegExp(`^${escapeRegExp('sme+')}$`, 'i'))
  //   ) {
  //     return total / 60;
  //   }
  // };

  const allPackages = useMemo(() => {
    if (!queryData?.subscriptionPackagesV2) {
      return [];
    }

    //sort packages by sequences;
    const sortedPackages = sortBy(
      queryData?.subscriptionPackagesV2,
      'sequence',
    );

    const firstThreePackages = sortedPackages.slice(0, 3);

    return firstThreePackages;
  }, [queryData?.subscriptionPackagesV2]);

  const startupPlanPackage = head(allPackages);
  const smePlanPackage = allPackages[1];
  const smePlusPlanPackage = allPackages[2];

  const featuresList = [
    [
      `${startupPlanPackage?.userQuota || 0} Users`,
      'Unlimited contacts storage',
      '50 GB Storage',
      'Invoices*',
      'Calendar and timeline view',
      '5 reports*',
      'Projects Templates Gallery',
    ],
    [
      `${smePlanPackage?.userQuota || 0} Users`,
      '100 GB Storage',
      'Included everything in Startup',
      'Unlimited Invoices & Quotation',
      'Time Tracking',
      'Claims',
      'Kanban View',
      'Unlimited reports',
      'Projects Templates Gallery	',
    ],
    [
      `${smePlusPlanPackage?.userQuota || 0} Users`,
      '250 GB Storage',
      'Included everything in Startup',
      'Unlimited Invoices & Quotation',
      'Time Tracking',
      'Claims',
      'Kanban View',
      'Unlimited reports',
      'Projects Templates Gallery',
    ],
  ];

  const getSubText = (subPackage: QuerySubscriptionPackage) => {
    // const currentSequence =
    //   queryData?.company?.currentSubscription?.package?.sequence || 0;

    const subPackageSequence = subPackage?.sequence || 0;
    // Add when on monthly plan, the yearly equivalent should say Upgrade and not Downgrade

    if (subPackageSequence === 0) {
      return 'Cancel Plan';
    }

    return 'Change Plan';

    // if (currentSequence > subPackageSequence) {
    //   return 'Downgrade';
    // } else if (currentSequence < subPackageSequence) {
    //   return 'Upgrade';
    // }

    // return 'Downgrade';
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Settings',
          },
          {
            name: 'Company',
          },
          {
            name: 'Subscription',
          },
        ]}
      />

      <Spin block loading={loading || mutateStartSubscriptionLoading}>
        <div className="bg-white p-4 mt-2">
          <h2 className="pt-0 pb-4">Subscription</h2>

          <div className="text-center mb-5">
            <Radio.Group
              type="button"
              size="large"
              options={[
                {
                  label: 'Yearly',
                  value: SubscriptionPriceInterval.Year,
                },
                {
                  label: 'Monthly',
                  value: SubscriptionPriceInterval.Month,
                },
              ]}
              value={interval}
              onChange={handleIntervalChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-3" style={{ minWidth: 800 }}>
            {allPackages.map((subPackage, index) => {
              const isActive =
                index === 0
                  ? !activeCompany?.currentSubscription?.stripeSubscriptionId
                  : queryData?.company?.currentSubscription?.intervalType ===
                      interval &&
                    !!queryData?.company?.currentSubscription?.package?.name?.match(
                      new RegExp(
                        `^${escapeRegExp(subPackage?.name as string)}$`,
                        'i',
                      ),
                    );
              const packageTotalPrice = getPackageTotalPrice(subPackage);

              // const perUserAmount = getPerUserAmount(subPackage);

              const title = getTitleBasedOnSequence(subPackage?.sequence || 0);

              return (
                <SubscriptionCard
                  key={subPackage?.id}
                  isActive={isActive}
                  title={title}
                  price={
                    index === 0
                      ? 'FREE'
                      : `${getCurrencyCode(
                          CURRENCY_CODE.MYR,
                        )}${formatToCurrency(
                          interval === SubscriptionPriceInterval.Month
                            ? packageTotalPrice
                            : packageTotalPrice / 12,
                        )}/mo`
                  }
                  unit={
                    index === 0 ? (
                      'Forever'
                    ) : interval === SubscriptionPriceInterval.Year ? (
                      <Tag>20% off</Tag>
                    ) : (
                      <div className="opacity-0">0</div>
                    )
                  }
                  features={featuresList[index]}
                  term={
                    index !== 0 && interval === SubscriptionPriceInterval.Year
                      ? 'Billed annually'
                      : undefined
                  }
                  total={index === 0 ? undefined : ``}
                  subscribeBtnText={getSubText(subPackage)}
                  onUpgrade={() => handleSelectPlan(subPackage)}
                />
              );
            })}
          </div>

          <div
            className="divide-y divide-gray-300 mt-10 "
            style={{ minWidth: 800 }}
          >
            <FeatureHead labels={['STARTUP', 'SME', 'SME+']} />

            <FeatureSection
              title="Fundamental"
              features={[
                {
                  label: 'Workspaces',
                  contents: ['Unlimited', 'Unlimited', 'Unlimited'],
                },
                {
                  label: 'Maximum Number of Teams',
                  contents: ['1', '5', 'Unlimited'],
                },
                {
                  label: 'Maximum Number of Users',
                  contents: [
                    `${allPackages[0]?.userQuota || 0}`,
                    `${allPackages[1]?.userQuota || 0}`,
                    `${allPackages[2]?.userQuota || 0}`,
                  ],
                },
                {
                  label: 'Contacts',
                  contents: ['Unlimited', 'Unlimited', 'Unlimited'],
                },
                {
                  label: 'Attendance',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Storage',
                  contents: ['50GB', '100GB', '250GB'],
                },
                {
                  label: 'Customer Support',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Assisted Onboarding (Paid)*',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Assisted Training (Paid)',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Assisted Implementation (Paid)*',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <div className="px-2 p-5 text-gray-500">
              Note*: Assisted onboarding and implementation (onsite for Klang
              Valley area) are available at 50% off for SME annual plan and
              complimentary for SME+ annual plan. For more information, kindly
              email {<Link>support@6biz.ai</Link>}. Terms and conditions
              applied.
            </div>

            <FeatureSection
              title="Structure"
              features={[
                {
                  label: 'Maximum Number of Tasks',
                  contents: [
                    `${allPackages[0]?.taskQuota || 0}`,
                    `${
                      (allPackages[1]?.taskQuota || 0) === -1
                        ? 'Unlimited'
                        : allPackages[1]?.taskQuota || 0
                    }`,
                    `${
                      (allPackages[2]?.taskQuota || 0) === -1
                        ? 'Unlimited'
                        : allPackages[1]?.taskQuota || 0
                    }`,
                  ],
                },
                {
                  label: 'Projects',
                  contents: ['Unlimited', 'Unlimited', 'Unlimited'],
                },
                {
                  label: 'Subtasks and checklist',
                  contents: ['Unlimited', 'Unlimited', 'Unlimited'],
                },
                {
                  label: 'Copy-paste',
                  contents: ['No', 'Yes', 'Yes'],
                },
              ]}
            />

            <FeatureSection
              title="Views"
              features={[
                {
                  label: 'Column',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Custom Column (Text)',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Custom Column (Number)',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Table',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Kanban',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Calendar',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Timeline',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Analytics',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Charts',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureSection
              title="Timesheet & Time Tracking"
              features={[
                {
                  label: 'Time Tracking',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Automated Time Track to Timesheet	',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Teams Timesheet',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Projects Timesheet',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Hourly Rate',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Cost Variance Report	',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Time Variance Report',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureSection
              title="Customization"
              features={[
                {
                  label: 'Filters',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Groups',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Multiple Select',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Projects Duplication',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Tasks Duplication',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureSection
              title="Collaboration / Permissions"
              features={[
                {
                  label: 'Basic Permissions',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Comments',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Task Sharing',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Notification',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Workspaces Permission',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Projects Permission',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Tasks Permission',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureSection
              title="Integrations"
              features={[
                {
                  label: 'Google Drive',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'OneDrive',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'CSV',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'SQL Accounting Software Export Format',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureSection
              title="Automation"
              features={[
                {
                  label: 'Reminders',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Recurring items',
                  contents: [
                    null,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureSection
              title="Web and Mobile Apps"
              features={[
                {
                  label: 'Web',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'Android',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
                {
                  label: 'iOS',
                  contents: [
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                    <MdCheck className="text-brand-500" />,
                  ],
                },
              ]}
            />

            <FeatureRow
              contents={[
                <Button
                  type="primary"
                  long
                  onClick={() => handleSelectPlanByType('startup')}
                >
                  Upgrade
                </Button>,
                <Button
                  type="primary"
                  long
                  onClick={() => handleSelectPlanByType('sme')}
                >
                  Upgrade
                </Button>,
                <Button
                  type="primary"
                  long
                  onClick={() => handleSelectPlanByType('sme+')}
                >
                  Upgrade
                </Button>,
              ]}
            />
          </div>
        </div>
      </Spin>
    </>
  );
};

const FeatureHead = ({
  labels,
  title,
}: {
  labels?: string[];
  title?: string;
}) => {
  return (
    <div className="grid grid-cols-5 text-lg font-bold">
      <div className="col-span-2 p-2">{title}</div>

      {labels?.map((label, index) => (
        <div
          key={index}
          className="text-center text-brand-500 tracking-wider p-2"
        >
          {label}
        </div>
      ))}
    </div>
  );
};

const FeatureRow = ({
  title,
  contents,
}: {
  title?: string;
  contents: ReactNode[];
}) => {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-2 p-2">{title}</div>

      {contents.map((content, index) => (
        <div key={index} className="text-center p-2">
          {content}
        </div>
      ))}
    </div>
  );
};

const FeatureSection = ({
  title,
  features,
}: {
  title: string;
  features: { label?: string; contents: ReactNode[] }[];
}) => {
  return (
    <>
      <FeatureHead title={title} />

      {features.map((feature, index) => (
        <FeatureRow
          key={index}
          title={feature.label}
          contents={feature.contents}
        />
      ))}
    </>
  );
};

const getTitleBasedOnSequence = (sequence: number) => {
  try {
    let title = 'Startup';

    if (sequence === 1) {
      title = 'SME';
    } else if (sequence === 2) {
      title = 'SME+';
    }

    return title;
  } catch (error) {
    return 'Startup';
  }
};

const companySubscriptionsPageQuery = gql`
  query CompanySubscriptionsPage($companyId: ID!) {
    company(id: $companyId) {
      id
      currentSubscription {
        id
        intervalType
        stripeSubscriptionId
        package {
          id
          sequence
          name
        }
        upcomingChanges {
          action
          actionData
          runAt
        }
      }
    }
    subscriptionPackagesV2 {
      id
      name
      isDefault
      sequence
      userQuota
      taskQuota
      teamQuota
      products {
        id
        prices {
          amount
          interval
        }
      }
    }
  }
`;

const startSubscriptionMutation = gql`
  mutation StartSubscription($input: StartSubscriptionInput!) {
    startSubscription(input: $input) {
      id
    }
  }
`;

const upgradeSubscriptionMutation = gql`
  mutation UpgradeSubscription($input: UpgradeSubscriptionInput!) {
    upgradeSubscription(input: $input) {
      id
    }
  }
`;

const downgradeSubscriptionMutation = gql`
  mutation DowngradeSubscription($input: DowngradeSubscriptionInput!) {
    downgradeSubscription(input: $input) {
      id
    }
  }
`;

const cancelSubscriptionMutation = gql`
  mutation CancelSubscriptionV2($input: CancelSubscriptionInput!) {
    cancelSubscriptionV2(input: $input) {
      id
    }
  }
`;

export default CompanySubscriptionsPage;
