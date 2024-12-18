import {
  Form,
  Space,
  Button,
  Grid,
  SwitchProps,
  Typography,
  Switch,
  Tooltip,
  Radio,
  FormInstance,
} from '@arco-design/web-react';
import { escapeRegExp, get, upperFirst } from 'lodash-es';
import { ReactNode } from 'react';
import { MdCheckCircle, MdOutlineCircle, MdOutlineInfo } from 'react-icons/md';

import styles from './SubscriptionFormItems.module.less';

import { formatToCurrency } from '@/utils/currency.utils';

import { OnboardingPageQuery } from 'generated/graphql-types';

const FormItem = Form.Item;

export type FormValues = {
  subscriptionInterval: 'month' | 'year';
  packageId: string;
};

type Props = {
  form: FormInstance;
  subscriptionPackages: OnboardingPageQuery['subscriptionPackagesV2'];
};

const SubscriptionFormItems = (props: Props) => {
  const { subscriptionPackages, form } = props;

  const getPackageTotalPrice = (title: string, interval: string) => {
    if (!subscriptionPackages) {
      return 0;
    }

    const foundPackage = subscriptionPackages.find((sub) =>
      sub?.name?.match(new RegExp(`^${escapeRegExp(title)}$`, 'i')),
    );
    if (!foundPackage?.products) {
      return 0;
    }

    const total = foundPackage.products.reduce((prev, product) => {
      const price = product?.prices?.find(
        (price) => price?.interval === interval,
      );

      return prev + (price?.amount || 0);
    }, 0);

    return total / 100;
  };

  return (
    <>
      <FormItem noStyle shouldUpdate>
        {(values) => (
          <div className="flex justify-center mb-4">
            <Button.Group className={styles['btn-group']}>
              {['month', 'year'].map((value) => {
                const isActive = values.subscriptionInterval === value;

                return (
                  <Button
                    key={value}
                    className={isActive ? styles.active : undefined}
                    onClick={() => {
                      form.setFieldValue('subscriptionInterval', value);
                    }}
                  >
                    {upperFirst(value)}ly
                  </Button>
                );
              })}
            </Button.Group>
          </div>
        )}
      </FormItem>

      <FormItem wrapperCol={{ span: 24 }} shouldUpdate>
        {(values) => (
          <SubscriptionPackageItem title="Plan">
            <FormItem field="packageId" rules={[{ required: true }]}>
              <Radio.Group direction="vertical">
                {subscriptionPackages?.map((sub, index) => {
                  const totalAmount = getPackageTotalPrice(
                    sub?.name as string,
                    values.subscriptionInterval,
                  );

                  const getSubTitle = () => {
                    //remove "V2" from title

                    const title = sub?.name?.replace('V2', '');

                    return title;
                  };

                  return (
                    <Radio
                      key={sub?.id}
                      value={totalAmount > 0 ? sub?.id : 'free'}
                    >
                      {({ checked }) => (
                        <SubscriptionPackageCard price={totalAmount}>
                          <Space>
                            <CheckedIcon checked={checked} />

                            <Typography.Text>{getSubTitle()}</Typography.Text>

                            <TooltipIcon content={planTooltips[index]} />
                          </Space>
                        </SubscriptionPackageCard>
                      )}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </FormItem>
          </SubscriptionPackageItem>
        )}
      </FormItem>
    </>
  );
};

const SubscriptionPackageItem = ({
  title,
  children,
  switchConfig,
}: {
  title: string;
  children: ReactNode;
  switchConfig?: {
    field: string;
    props?: SwitchProps;
  };
}) => {
  return (
    <div className={styles['package-item']}>
      <Grid.Row className="mb-4 font-semibold" justify="space-between">
        <Typography.Text className={styles.title}>{title}</Typography.Text>

        {switchConfig && (
          <FormItem field={switchConfig.field} noStyle shouldUpdate>
            {(values) => (
              <Switch
                checked={get(values, switchConfig.field)}
                {...switchConfig.props}
              />
            )}
          </FormItem>
        )}
      </Grid.Row>

      {children}
    </div>
  );
};

const SubscriptionPackageCard = ({
  children,
  price,
}: {
  children: ReactNode;
  price: number;
}) => {
  return (
    <Grid.Row
      className="px-4 py-3 rounded-sm border border-[#e5e6e8] border-solid"
      justify="space-between"
      align="center"
    >
      {children}

      <Typography.Text className="text-[#165dff]">
        {price === 0 ? 'Free' : `RM ${formatToCurrency(price, true)}`}
      </Typography.Text>
    </Grid.Row>
  );
};

const CheckedIcon = ({ checked }: { checked: boolean }) => {
  return (
    <div className={styles['checked-icon-wrapper']}>
      {checked ? (
        <MdCheckCircle className={styles['checked-icon']} />
      ) : (
        <MdOutlineCircle />
      )}
    </div>
  );
};

const TooltipIcon = ({ content }: { content?: string[] }) => {
  return (
    <Tooltip style={{ whiteSpace: 'pre-wrap' }} content={content?.join('\n')}>
      <MdOutlineInfo className="text-gray-300 text-xs align-[-1px]" />
    </Tooltip>
  );
};

const planTooltips = [
  [
    '3 Users',
    'Unlimited contacts storage',
    '50GB Storage',
    '5 Invoices',
    'Calendar and timeline view',
    '5 reports',
  ],
  [
    '20 Users',
    '100GB Storage',
    'Included everything in startup',
    'Unlimited invoices & quotation',
    'Time tracking',
    'Claims',
    'Kanban View',
    'Unlimited reports',
  ],
  [
    '40 Users',
    '250GB Storage',
    'Included everything in startup',
    'Unlimited invoices & quotation',
    'Time tracking',
    'Claims',
    'Kanban View',
    'Unlimited reports',
  ],
];

export default SubscriptionFormItems;
