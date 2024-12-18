import {
  Button,
  Form,
  FormInstance,
  Grid,
  Select,
  Space,
} from '@arco-design/web-react';
import type { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import dayjs from 'dayjs';

import AttendanceForm from './AttendanceForm';
import InvoiceForm from './InvoiceForm';
import ProjectForm from './ProjectForm';
import styles from './ReportFormPage.module.less';

import { useAppStore } from '@/stores/useAppStore';

import { ReportTypeService } from '@/services/report.service';

import { SelectOption } from '@/types';

const FormItem = Form.Item;

export type FormValues = {
  type: 'attendance' | 'project' | 'invoice';
  attendance: {
    dateRange: Date[];
    memberIds: string[];
    activityLabelIds: string[];
    employeeTypeId: string;
    contactIds: string[];
    tagIds: string[];
  };
  project: {
    userId: string;
    companyId: string;
    dateRange?: Date[];
    projectIds?: string[];
    assigneeId?: string;
    teamId?: string;
    projectOwnerIds?: string[];
    reportType: ReportTypeService;
  };
  invoice: {
    dateRange: Date[];
    workspaceId: string;
  };
};

type Props = {
  reportTypeOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  contactOptions: SelectOption[];
  tagGroupTreeData: TreeDataType[];
  attendanceLabelOptions: SelectOption[];
  employeeTypeOptions: SelectOption[];
  projectOptions: SelectOption[];
  projectOwnerOptions: SelectOption[];
  companyTeamOptions: SelectOption[];
  workspaceOptions: SelectOption[];
  onSubmit: (values: FormValues) => void;
};

const ReportForm = (props: Props) => {
  const { currentUser, activeCompany } = useAppStore();

  const {
    reportTypeOptions,
    companyMemberOptions,
    contactOptions,
    tagGroupTreeData,
    attendanceLabelOptions,
    employeeTypeOptions,
    projectOptions,
    projectOwnerOptions,
    workspaceOptions,
    companyTeamOptions,
    onSubmit,
  } = props;

  const [form] = Form.useForm<FormValues>();

  const handleResetForm = () => {
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
    });
  };

  // TODO: update picids when remove contact

  return (
    <Form
      form={form}
      initialValues={{
        type: 'project',
        invoice: {
          workspaceId: 'all',
          dateRange: [
            dayjs().startOf('month').toDate(),
            dayjs().endOf('month').toDate(),
          ],
        },
        project: {
          companyId: activeCompany?.id as string,
          userId: currentUser?.id as string,
          reportType: 'project',
        },
      }}
    >
      <FormItem label="Modal" rules={[{ required: true }]} field="type">
        <Select options={reportTypeOptions} />
      </FormItem>

      <FormItem noStyle shouldUpdate>
        {(values) => (
          <>
            {values.type === 'attendance' && (
              <AttendanceForm
                attendanceLabelOptions={attendanceLabelOptions}
                companyMemberOptions={companyMemberOptions}
                tagGroupTreeData={tagGroupTreeData}
                employeeTypeOptions={employeeTypeOptions}
                contactOptions={contactOptions}
              />
            )}
            {values.type === 'project' && (
              <ProjectForm
                projectOptions={projectOptions}
                projectOwnerOptions={projectOwnerOptions}
                companyMemberOptions={companyMemberOptions}
                reportType={values.project.reportType}
                companyTeamOptions={companyTeamOptions}
              />
            )}
            {values.type === 'invoice' && (
              <InvoiceForm
                form={form as FormInstance}
                workspaceOptions={workspaceOptions}
              />
            )}
          </>
        )}
      </FormItem>

      <FormItem wrapperCol={{ span: 24 }}>
        <Grid.Row justify="end">
          <Space>
            <Button onClick={handleResetForm}>Reset</Button>

            <Button className={styles['theme-button']} onClick={handleSubmit}>
              Generate
            </Button>
          </Space>
        </Grid.Row>
      </FormItem>
    </Form>
  );
};

export default ReportForm;
