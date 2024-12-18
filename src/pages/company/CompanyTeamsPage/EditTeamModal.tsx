import { gql } from '@apollo/client';
import {
  Modal,
  Form,
  Input,
  Select,
  SelectProps,
} from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';
import { useEffect } from 'react';
import { MdPersonAddAlt } from 'react-icons/md';

import { FormLabel } from '@/components';

import type { ArrayElement, BaseModalConfig } from '@/types';

import type { CompanyTeamsPageQuery } from 'generated/graphql-types';

type QueryCompanyTeam = ArrayElement<
  NonNullable<CompanyTeamsPageQuery['company']>['teams']
>;

const FormItem = Form.Item;

export const editTeamModalFragment = gql`
  fragment EditTeamModalFragment on CompanyMember {
    id
    user {
      id
      email
      name
    }
  }
`;

export type FormValues = {
  name: string;
  memberIds: string[];
};

type Props = BaseModalConfig & {
  loading: boolean;
  companyTeam: QueryCompanyTeam | undefined;
  onCreate: (values: FormValues) => void;
  onUpdate: (values: FormValues) => void;
  companyMemberOptions: SelectProps['options'];
};

const EditTeamModal = (props: Props) => {
  const {
    visible,
    onCancel,
    loading,
    onCreate,
    onUpdate,
    companyMemberOptions,
    companyTeam,
  } = props;

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      if (companyTeam) {
        form.setFieldsValue({
          name: companyTeam.title as string,
          memberIds: companyTeam.members?.map((member) => member?.id),
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, companyTeam]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      if (companyTeam) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  return (
    <Modal
      title="Add team"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save"
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={!loading}
      escToExit={!loading}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label={
            <FormLabel label="Team name" tooltip="Fill in the team name." />
          }
          field="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter team name" showWordLimit maxLength={100} />
        </FormItem>

        <FormItem
          label={
            <FormLabel
              label="Team member"
              tooltip="Select the member from the list. The user needs to be in your company member list first."
            />
          }
          field="memberIds"
          rules={[{ required: true }]}
        >
          <Select
            mode="multiple"
            options={companyMemberOptions}
            suffixIcon={<MdPersonAddAlt />}
            filterOption={(inputValue, option) => {
              const regex = new RegExp(escapeRegExp(inputValue), 'i');

              return option.props.children.match(regex);
            }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default EditTeamModal;
