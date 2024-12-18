import { Button, Dropdown, Progress } from '@arco-design/web-react';
import bytes from 'bytes';
import { useNavigate } from 'react-router-dom';

import { useAppStore } from '@/stores/useAppStore';

import { navigateCompanySubscriptionsPage } from '@/navigation';

const SubscriptionDropdown = () => {
  const navigate = useNavigate();

  const { activeCompany } = useAppStore();

  const handleUpgradePlan = () => {
    if (!activeCompany?.slug) {
      return;
    }

    navigateCompanySubscriptionsPage({
      navigate,
      companySlug: activeCompany.slug,
    });
  };

  const getUsedQuota = (
    field:
      | 'invoiceQuota'
      | 'teamQuota'
      | 'storageQuota'
      | 'reportQuota'
      | 'taskQuota'
      | 'userQuota',
  ) => {
    const currentQuota = activeCompany?.currentSubscription?.[field] || 0;
    const packageQuota =
      activeCompany?.currentSubscription?.package?.[field] || 0;

    return packageQuota - currentQuota;
  };

  return (
    <Dropdown
      trigger="click"
      droplist={
        <div className="bg-white shadow w-52 divide-y divide-gray-300">
          <div className="p-3 font-bold">
            {activeCompany?.currentSubscription?.package?.name?.replace(
              'V2',
              '',
            )}{' '}
            Plan
          </div>

          <SubscriptionItem
            title="Teams"
            quota={{
              used: getUsedQuota('teamQuota'),
              total:
                activeCompany?.currentSubscription?.package?.teamQuota || 0,
            }}
          />

          <SubscriptionItem
            title="Members"
            quota={{
              used: getUsedQuota('userQuota'),
              total:
                activeCompany?.currentSubscription?.package?.userQuota || 0,
            }}
          />

          <SubscriptionItem
            title="Storage"
            quota={{
              used: getUsedQuota('storageQuota'),
              total:
                activeCompany?.currentSubscription?.package?.storageQuota || 0,
              usedFormat: (value) => bytes(value),
              totalFormat: (value) => bytes(value),
            }}
          />

          <SubscriptionItem
            title="Task"
            quota={{
              used: getUsedQuota('taskQuota'),
              total:
                activeCompany?.currentSubscription?.package?.taskQuota || 0,
            }}
          />

          <SubscriptionItem
            title="Invoices"
            quota={{
              used: getUsedQuota('invoiceQuota'),
              total:
                activeCompany?.currentSubscription?.package?.invoiceQuota || 0,
            }}
          />

          <SubscriptionItem
            title="Reports"
            quota={{
              used: getUsedQuota('reportQuota'),
              total:
                activeCompany?.currentSubscription?.package?.reportQuota || 0,
            }}
          />

          <div className="p-3">
            <Button type="primary" long onClick={handleUpgradePlan}>
              Upgrade your plan
            </Button>
          </div>
        </div>
      }
    >
      <Button className="px-2" type="text" shape="round">
        <Progress size="mini" type="circle" percent={60} showText={false} />
      </Button>
    </Dropdown>
  );
};

const SubscriptionItem = ({
  title,
  quota,
}: {
  title: string;
  quota: {
    used: number;
    total: number;
    usedFormat?: (used: number) => string;
    totalFormat?: (total: number) => string;
  };
}) => {
  const percent = (quota.used / quota.total) * 100;

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div>{title}</div>

        <div className="text-xs text-gray-600">
          {quota.total < 0
            ? 'Unlimited'
            : `${quota.usedFormat?.(quota.used) || quota.used} of ${
                quota.totalFormat?.(quota.total) || quota.total
              } used`}
        </div>
      </div>

      <Progress
        percent={percent}
        showText={false}
        status={quota.total < 0 || percent < 100 ? 'success' : 'error'}
      />
    </div>
  );
};

export default SubscriptionDropdown;
