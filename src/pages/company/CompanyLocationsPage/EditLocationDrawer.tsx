import {
  Button,
  Drawer,
  Form,
  Grid,
  Input,
  Space,
} from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, GoogleMap } from '@/components';

import styles from './EditLocationDrawer.module.less';

import type { ArrayElement, BaseModalConfig } from '@/types';

import type { CompanyLocationsPageQuery } from 'generated/graphql-types';

type QueryLocation = ArrayElement<CompanyLocationsPageQuery['locations']>;

type Props = BaseModalConfig & {
  location: QueryLocation | undefined;
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  // radius: number;
};

export const EditLocationDrawer = (props: Props) => {
  const { visible, onCancel, location, loading, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (location) {
      form.setFieldsValue({
        name: location.name as string,
        // radius: location.radius as number,
      });
    }
  }, [location]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Drawer
      className={styles.drawer}
      visible={visible}
      onCancel={onCancel}
      width={640}
      title="Edit Location"
      maskClosable={!loading}
      escToExit={!loading}
      closable={!loading}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item>
          <div className={styles['google-map-container']}>
            <GoogleMap
              center={
                location
                  ? {
                      lat: location.lat as number,
                      lng: location.lng as number,
                    }
                  : undefined
              }
            />
          </div>
        </Form.Item>

        <Form.Item
          label={<FormLabel label="Location Name" />}
          field="name"
          rules={[{ required: true }]}
        >
          <Input showWordLimit maxLength={100} />
        </Form.Item>

        <Form.Item label={<FormLabel label="Address" />}>
          <Input.TextArea value={location?.address || ''} disabled />
        </Form.Item>

        {/* <Form.Item
          label={<FormLabel label="Detectable Radius" />}
          field="radius"
        >
          <Select
            options={[
              {
                label: '10 Meters',
                value: 10,
              },
              {
                label: '20 Meters',
                value: 20,
              },
              {
                label: '50 Meters',
                value: 50,
              },
              {
                label: '100 Meters',
                value: 100,
              },
              {
                label: '200 Meters',
                value: 200,
              },
            ]}
          />
        </Form.Item> */}

        <Form.Item>
          <Grid.Row justify="end">
            <Space>
              <Button disabled={loading} onClick={onCancel}>
                Cancel
              </Button>

              <Button
                className={styles['theme-btn']}
                onClick={handleSubmit}
                loading={loading}
              >
                Update
              </Button>
            </Space>
          </Grid.Row>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
