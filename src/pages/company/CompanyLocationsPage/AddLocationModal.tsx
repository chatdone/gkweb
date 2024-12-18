import { Modal, Form, Input } from '@arco-design/web-react';
import { useEffect } from 'react';

import { FormLabel, GoogleMapSearchInput, GoogleMap } from '@/components';

import styles from './AddLocationModal.module.less';

import type { BaseModalConfig } from '@/types';

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  location: google.maps.places.PlaceResult;
  // radius: number;
};

export const AddLocationModal = (props: Props) => {
  const { visible, onCancel, loading, onSubmit } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="Add Location"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form className={styles['form-wrapper']} layout="vertical" form={form}>
        <FormItem field="location" rules={[{ required: true }]}>
          <GoogleMapSearchInput />
        </FormItem>

        <FormItem shouldUpdate>
          {(values) => (
            <div className={styles['google-map-container']}>
              <GoogleMap
                center={
                  values?.address
                    ? {
                        lat: values.location.geometry.location.lat(),
                        lng: values.location.geometry.location.lng(),
                      }
                    : undefined
                }
              />
            </div>
          )}
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Location Name"
              tooltip="Fill in the location name."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Insert location name"
            showWordLimit
            maxLength={100}
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Address"
              tooltip="The address for the location. It will be auto-filled upon searching the location."
            />
          }
          field="location"
          shouldUpdate
        >
          {(values) => (
            <>
              <Input.TextArea
                value={values?.location?.formatted_address}
                disabled
              />
            </>
          )}
        </FormItem>

        {/* <FormItem
          label={<FormLabel label="Detectable Radius" tooltip="Radius" />}
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
        </FormItem> */}
      </Form>
    </Modal>
  );
};
