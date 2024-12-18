import { Form, Radio, Select } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { SelectOption } from '@/types';

import { CommonVisibility, TaskModalPageQuery } from 'generated/graphql-types';

export type FormValues = {
  type: CommonVisibility;
  teamIds?: string[];
  memberIds?: string[];
};

type Props = {
  loading: boolean;
  task: TaskModalPageQuery['task'];
  companyTeamOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  onUpdate: (values: FormValues) => void;
};

const TaskModalVisibility = (props: Props) => {
  const { task, onUpdate, companyMemberOptions, companyTeamOptions } = props;

  const [form] = Form.useForm<FormValues>();

  const [currentType, setType] = useState<CommonVisibility>(
    task?.visibility || CommonVisibility.Public,
  );

  useEffect(() => {
    form.resetFields();

    form.setFieldsValue({
      // @ts-ignore
      type: task?.visibility,
      teamIds: task?.visibilityWhitelist?.teams?.map((team) => team?.id),
      memberIds: task?.visibilityWhitelist?.members?.map(
        (member) => member?.id,
      ),
    });
  }, [task]);

  useEffect(() => {
    const values = form.getFields() as FormValues;
    if (values?.type === CommonVisibility.Specific) {
      setType(CommonVisibility.Specific);
    } else if (values?.type === CommonVisibility.Private) {
      setType(CommonVisibility.Private);
    } else {
      setType(CommonVisibility.Public);
    }
  }, [form]);

  const handleSubmit = () => {
    form.validate().then(() => {
      const values = form.getFields() as FormValues;
      if (values?.type === CommonVisibility.Specific) {
        onUpdate({
          type: values.type,
          teamIds: values.teamIds,
          memberIds: values.memberIds,
        });
      } else {
        onUpdate({
          type: values.type,
        });
      }
    });
  };

  useEffect(() => {
    console.log(currentType);
  }, [currentType]);

  return (
    <Form form={form} layout="vertical" onChange={() => handleSubmit()}>
      <div className="m-4">
        <Form.Item
          field="type"
          onChange={(e) => {
            console.log(e);
            //@ts-ignore
            setType(e.target?.value);
          }}
        >
          <Radio.Group
            type="button"
            value={currentType}
            options={[
              {
                label: 'Public',
                value: CommonVisibility.Public,
              },
              {
                label: 'Private',
                value: CommonVisibility.Private,
              },
              {
                label: 'Custom',
                value: CommonVisibility.Specific,
              },
            ]}
          />
        </Form.Item>
        {currentType === CommonVisibility.Specific && (
          <Form.Item field="visibility.teamIds" label="Teams">
            (
            <Select showSearch mode="multiple" options={companyTeamOptions} />)
          </Form.Item>
        )}

        {currentType === CommonVisibility.Specific && (
          <Form.Item field="visibility.memberIds" label="Members">
            {(values) =>
              values?.visibility?.type === CommonVisibility.Specific && (
                <Select
                  showSearch
                  mode="multiple"
                  options={companyMemberOptions}
                />
              )
            }
          </Form.Item>
        )}
        {/* {task?.visibility !== form?.getFieldValue('type') ? null : (
          <div>
            Confirm Change?
            <div>
              <Button onClick={handleSubmit}>Yes</Button>
              <Button>No</Button>
            </div>
          </div>
        )} */}
      </div>
    </Form>
  );
};

export default TaskModalVisibility;
