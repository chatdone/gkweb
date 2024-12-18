import {
  Button,
  Drawer,
  Form,
  Grid,
  InputNumber,
  Space,
  Typography,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import styles from './EditSubscriptionDrawer.module.less';
import RemoveWhitelistedMemberModal from './RemoveWhitelistedMemberModal';

import { useDisclosure } from '@/hooks';

import { formatToCurrency, getCurrencyCode } from '@/utils/currency.utils';

import { ArrayElement, BaseModalConfig } from '@/types';

import { CompanySubscriptionInfoPageQuery } from 'generated/graphql-types';

const FormItem = Form.Item;

type QueryWhitelistedCompanyMember = ArrayElement<
  NonNullable<
    NonNullable<
      NonNullable<
        CompanySubscriptionInfoPageQuery['companySubscription']
      >['whiteListedMembers']
    >['companyMembers']
  >
>;

export type FormValues = {
  quantity: number;
};

type Props = BaseModalConfig & {
  companySubscription: CompanySubscriptionInfoPageQuery['companySubscription'];
  loading: boolean;
  onUnsubscribe: () => void;
  onUpdate: (values: FormValues) => void;
  onRemoveWhitelistedMember: (member: QueryWhitelistedCompanyMember) => void;
};

const EditSubscriptionDrawer = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    companySubscription,
    onUnsubscribe,
    onUpdate,
    onRemoveWhitelistedMember,
  } = props;

  const [form] = Form.useForm<FormValues>();

  const removeMemberModalState = useDisclosure();

  useEffect(() => {
    if (visible && companySubscription) {
      form.setFieldsValue({
        quantity: companySubscription.whiteListedMembers?.total as number,
      });
    }
  }, [visible]);

  const handleNext = () => {
    form.validate().then((value) => {
      const assigned = companySubscription?.whiteListedMembers?.assigned || 0;

      if (value.quantity < assigned) {
        removeMemberModalState.onOpen();
      } else {
        onUpdate(value);
      }
    });
  };

  const getFormattedPackageTitle = () => {
    if (!companySubscription?.packageTitle) {
      return '-';
    }

    const title = companySubscription.packageTitle.replace('Omni', '');
    const interval =
      companySubscription.interval === 'month' ? 'Monthly' : 'Annual';

    return `${title} (${interval} Plan)`;
  };

  const getUpdateQuotaMessage = (quota: number) => {
    const total = companySubscription?.whiteListedMembers?.total || 0;

    return quota > total
      ? `Total ${quota - total} users will be added`
      : `Total ${total - quota} users will be reduced`;
  };

  const getPrice = () => {
    if (!companySubscription?.price || !companySubscription.quantity) {
      return '-';
    }

    const currencyCode = getCurrencyCode(
      companySubscription.subscriptionPackagePrice?.currency,
    );
    const total = companySubscription.price * companySubscription.quantity;
    const price = formatToCurrency(total);

    return `${currencyCode} ${price} (${currencyCode} ${formatToCurrency(
      companySubscription.price,
    )} per user)`;
  };

  return (
    <>
      <Drawer
        visible={visible}
        onCancel={onCancel}
        title="Edit Plan"
        width={551}
        footer={null}
        escToExit={!loading}
        maskClosable={!loading}
        closable={!loading}
      >
        <Form className={styles.wrapper} form={form} layout="vertical">
          <FormItem label="Plan name">
            <Typography.Text>{getFormattedPackageTitle()}</Typography.Text>
          </FormItem>

          <FormItem label="Usage / Quota">
            <Typography.Text>{`${companySubscription?.whiteListedMembers?.assigned} /${companySubscription?.whiteListedMembers?.total}`}</Typography.Text>
          </FormItem>

          <FormItem label="Renewal date">
            <Typography.Text>
              {dayjs(companySubscription?.endDate).format('DD MMMM YYYY')}
            </Typography.Text>
          </FormItem>

          <FormItem label="Price">
            <Typography.Text>{getPrice()}</Typography.Text>
          </FormItem>

          <FormItem>
            <FormItem label="Update quota" field="quantity">
              <InputNumber min={1} precision={0} />
            </FormItem>

            <FormItem noStyle shouldUpdate>
              {(value) =>
                value.quantity !==
                  companySubscription?.whiteListedMembers?.total && (
                  <Typography.Text className={styles['warning-txt']}>
                    {getUpdateQuotaMessage(value.quantity)}
                  </Typography.Text>
                )
              }
            </FormItem>
          </FormItem>

          <FormItem>
            <Grid.Row justify="space-between">
              <Button
                className={styles['theme-btn-text']}
                type="text"
                disabled={loading}
                onClick={onUnsubscribe}
              >
                Unsubscribe
              </Button>

              <Space>
                <Button disabled={loading} onClick={onCancel}>
                  Cancel
                </Button>

                <Button
                  className={styles['theme-button']}
                  loading={loading}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Space>
            </Grid.Row>
          </FormItem>
        </Form>
      </Drawer>

      <RemoveWhitelistedMemberModal
        visible={removeMemberModalState.visible}
        onCancel={removeMemberModalState.onClose}
        quantity={form.getFieldValue('quantity')}
        whitelistedMembers={companySubscription?.whiteListedMembers}
        onRemove={onRemoveWhitelistedMember}
      />
    </>
  );
};

export default EditSubscriptionDrawer;
