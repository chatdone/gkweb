import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  SelectProps,
  Space,
  Typography,
} from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';
import { useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';

import { FormLabel, PhoneInput, CompanyTagInput } from '@/components';

import styles from './AddContactModal.module.less';

import { contactTypeOptions } from '@/constants/contact.constants';

import type { BaseModalConfig } from '@/types';

import { ContactListPageQuery, ContactType } from 'generated/graphql-types';

const FormItem = Form.Item;

type Props = BaseModalConfig & {
  loading: boolean;
  tagGroups: ContactListPageQuery['tagGroups'];
  companyMemberOptions: SelectProps['options'];
  contactGroupOptions: SelectProps['options'];
  onSubmit: (values: FormValues) => void;
};

export type FormValues = {
  name: string;
  type: ContactType;
  groupId: string;
  note: string;
  address: string;
  dealOwnerId: string;
  dealAmount: number;
  pics: { name: string; contactNo: string; email: string }[];
  tagIds: string[];
};

export const AddContactModal = (props: Props) => {
  const {
    visible,
    onCancel,
    tagGroups,
    loading,
    onSubmit,
    companyMemberOptions,
    contactGroupOptions,
  } = props;

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
      title="Add Contact"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={
            <FormLabel
              label="Contact name"
              tooltip="Fill in your contact name. It can be an individual name or company name."
            />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Write a contact name"
            maxLength={100}
            showWordLimit
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Type"
              tooltip="Select Company if it is a company or Personal if the contact is an individual."
            />
          }
          field="type"
          rules={[{ required: true }]}
        >
          <Select options={contactTypeOptions} />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Group"
              tooltip="Select a contact group to categorize your contacts."
            />
          }
          field="groupId"
        >
          <Select
            showSearch
            placeholder="Select Group"
            allowClear
            options={contactGroupOptions}
            filterOption={(inputValue, option) => {
              const regex = new RegExp(escapeRegExp(inputValue), 'i');

              return option.props.children.match(regex);
            }}
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Deal Owner"
              tooltip="Select the person who is in charge for this contact."
            />
          }
          field="dealOwnerId"
        >
          <Select
            showSearch
            allowClear
            placeholder="Select deal owner"
            options={companyMemberOptions}
            filterOption={(inputValue, option) => {
              const regex = new RegExp(escapeRegExp(inputValue), 'i');

              return option.props.children.match(regex);
            }}
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Tag"
              tooltip="Select tag(s) to organize your contacts."
            />
          }
          field="tagIds"
        >
          <CompanyTagInput tagGroups={tagGroups} mode="select" />
        </FormItem>

        <FormItem
          label={
            <FormLabel label="Note" tooltip="Record a note for your contact." />
          }
          field="note"
        >
          <Input.TextArea
            placeholder="Write something about the contact"
            autoSize
          />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Address"
              tooltip="Fill in the contact's address."
            />
          }
          field="address"
        >
          <Input.TextArea placeholder="Write contact's address" autoSize />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Deal Amount"
              tooltip="Fill in the deal amount for your contact. It will be in numerical format."
            />
          }
          field="dealAmount"
        >
          <InputNumber min={0} />
        </FormItem>

        <Form.List field="pics">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((item, index) => (
                  <div className={styles['pic-list-item']} key={item.key}>
                    <FormItem
                      label={
                        <Space>
                          <Typography.Text>{`Contact Person ${
                            index + 1
                          }`}</Typography.Text>

                          <Button
                            shape="circle"
                            icon={<MdDelete />}
                            size="mini"
                            onClick={() => remove(index)}
                          />
                        </Space>
                      }
                    >
                      <FormItem
                        label={<FormLabel label="Name" />}
                        field={`${item.field}.name`}
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder="Write a contact name"
                          maxLength={100}
                          showWordLimit
                        />
                      </FormItem>

                      <FormItem
                        label={<FormLabel label="Number" />}
                        field={`${item.field}.contactNo`}
                      >
                        <PhoneInput />
                      </FormItem>

                      <FormItem
                        label={<FormLabel label="Email" />}
                        field={`${item.field}.email`}
                      >
                        <Input placeholder="contact_person@email.com" />
                      </FormItem>
                    </FormItem>
                  </div>
                ))}

                <Button icon={<MdAdd />} onClick={() => add()}>
                  Add Contact Person
                </Button>
              </div>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};
