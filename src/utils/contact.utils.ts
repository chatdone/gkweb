import dayjs from 'dayjs';

import { ContactActivityRaw } from 'generated/graphql-types';

const parseContactActivity = (
  activity: ContactActivityRaw,
  userTimezone?: string,
) => {
  const { action, previousValues, currentValues, changedValues } = activity;

  const parsedChangedValues = JSON.parse(changedValues as string);
  const parsedCurrentValues = JSON.parse(currentValues as string);
  const parsedPreviousValues = JSON.parse(previousValues as string);

  const timezone = userTimezone || dayjs.tz.guess();

  const getTimezoneDateTime = (timestamp: string) => {
    return dayjs(timestamp).tz(timezone).format('LT, DD MMM, YYYY');
  };

  let title = '';
  let description = '';

  switch (action) {
    case 'create': {
      if (parsedChangedValues?.collection) {
        title = 'Collection created';

        description = `Collection ${parsedCurrentValues?.title} has been created by ${parsedCurrentValues?.created_by_name}`;
      } else if (parsedChangedValues?.spPayment) {
        title = 'Collection created';
        description = `Collection ${parsedChangedValues?.title} has been created`;
      } else if (parsedChangedValues?.task) {
        title = 'Task created';
        description = `Task ${parsedCurrentValues?.name} has been created by ${parsedCurrentValues?.created_by_name}`;
      } else if (parsedChangedValues?.project_task) {
        title = 'Project Task created';
        description = `Task ${parsedCurrentValues?.name} has been created by ${parsedCurrentValues?.created_by_name}`;
      } else if (parsedChangedValues?.contact) {
        title = 'Contact created';
        description = `Contact ${parsedCurrentValues?.name} has been created by ${parsedCurrentValues?.created_by_name}`;
      } else if (parsedChangedValues?.contact_pic) {
        title = 'Contact person created';
        description = `Contact person ${parsedCurrentValues?.name} has been added by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.dealOwner) {
        title = 'Deal Owner added';

        description = `${parsedChangedValues?.updatedByName} has changed deal owner to ${parsedCurrentValues?.to}`;
      }

      break;
    }

    case 'update': {
      if (parsedChangedValues?.task && parsedChangedValues?.due_date) {
        title = 'Task updated';

        description = parsedPreviousValues.due_date
          ? `Due date for task ${
              parsedCurrentValues.name
            } has been updated from ${getTimezoneDateTime(
              parsedPreviousValues.due_date,
            )} to ${getTimezoneDateTime(parsedCurrentValues.due_date)}`
          : `Due date for task ${
              parsedCurrentValues?.name
            } has been updated to ${getTimezoneDateTime(
              parsedCurrentValues.due_date,
            )} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task &&
        parsedChangedValues?.start_date
      ) {
        const previous = `${dayjs(parsedPreviousValues?.start_date).format(
          'LL',
        )} - ${dayjs(parsedPreviousValues?.end_date).format('LL')}`;
        const current = `${dayjs(parsedCurrentValues?.start_date).format(
          'LL',
        )} - ${dayjs(parsedCurrentValues?.end_date).format('LL')}`;

        title = 'Project task updated';
        description = `Targeted date for project task ${parsedCurrentValues?.name} has been updated from ${previous} to ${current} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.task &&
        parsedChangedValues?.company_team_status
      ) {
        title = 'Task updated';
        description = `Status for task ${parsedCurrentValues?.name} has been updated from ${parsedPreviousValues?.label} to ${parsedCurrentValues?.label} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task &&
        parsedChangedValues?.company_team_status
      ) {
        title = 'Project Task updated';
        description = `Status for project task ${parsedCurrentValues?.name} has been updated from ${parsedPreviousValues?.label} to ${parsedCurrentValues?.label} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.due_date
      ) {
        const previous = dayjs(parsedPreviousValues?.due_date).format(
          'DD MMM, YYYY',
        );
        const current = dayjs(parsedCurrentValues?.due_date).format(
          'DD MMM, YYYY',
        );

        title = 'Collection updated';

        description = `Due date for collection ${parsedCurrentValues?.title} has been updated from ${previous} to ${current} by ${parsedCurrentValues?.updated_by_name}`;

        if (previous.includes('Invalid Date')) {
          description = `Due date for collection ${parsedCurrentValues?.title} has been set to ${current} by ${parsedCurrentValues?.updated_by_name}`;
        }
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.title
      ) {
        title = 'Collection updated';
        description = `Title for collection ${parsedPreviousValues?.title} has been updated to ${parsedCurrentValues?.title} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.ref_no
      ) {
        title = 'Collection updated';
        description = `Invoice number for collection ${parsedPreviousValues?.title} has been updated from ${parsedPreviousValues?.ref_no} to ${parsedCurrentValues?.ref_no} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.contact && parsedChangedValues?.name) {
        title = 'Contact updated';
        description = `Title for contact ${parsedPreviousValues?.name} has been updated to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.contact && parsedChangedValues?.type) {
        const previousType =
          parsedPreviousValues.type === 'COMPANY' ? 'COMPANY' : 'PERSONAL';
        const currentType =
          parsedCurrentValues.type === 'COMPANY' ? 'COMPANY' : 'PERSONAL';

        title = 'Contact updated';
        description = `Type for contact ${parsedPreviousValues?.name} has been updated from ${previousType} to ${currentType}`;
      } else if (parsedChangedValues?.contact && parsedChangedValues?.address) {
        title = 'Contact updated';
        description = `Address for contact ${parsedPreviousValues?.name} has been updated to ${parsedCurrentValues?.address}`;
      } else if (
        parsedChangedValues?.contact_pic_name &&
        !parsedChangedValues?.contact_no
      ) {
        title = 'Contact person updated';
        description = `Contact person name ${parsedPreviousValues?.contact_pic_name} has been updated to ${parsedCurrentValues?.contact_pic_name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        !parsedChangedValues?.contact_pic_name &&
        parsedChangedValues?.contact_no
      ) {
        title = 'Contact person updated';
        description = `Phone number for contact person ${parsedPreviousValues?.contact_pic_name} has been updated from ${parsedPreviousValues?.contact_no} to ${parsedCurrentValues?.contact_no} by ${parsedCurrentValues?.updated_by_name}`;

        if (!parsedPreviousValues?.contact_no) {
          description = `Phone number for contact person ${parsedPreviousValues?.contact_pic_name} has been set to ${parsedCurrentValues?.contact_no} by ${parsedCurrentValues?.updated_by_name}`;
        }
      } else if (
        parsedChangedValues?.contact_pic_name &&
        parsedChangedValues?.contact_no
      ) {
        title = 'Contact person updated';
        description = `Contact person name and phone number ${parsedPreviousValues?.contact_pic_name}(${parsedPreviousValues?.contact_no}) has been updated to ${parsedCurrentValues?.contact_pic_name}(${parsedCurrentValues.contact_no}) by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.task && parsedChangedValues?.archive) {
        title = 'Task archived';
        description = `Task ${parsedCurrentValues?.name} has been archived by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task &&
        parsedChangedValues?.archive
      ) {
        title = 'Project Task archived';
        description = `Project Task ${parsedCurrentValues?.name} has been archived by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.task &&
        parsedChangedValues?.archive === false
      ) {
        title = 'Task unarchived';
        description = `Task ${parsedCurrentValues?.name} has been unarchived by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task &&
        parsedChangedValues?.archive === false
      ) {
        title = 'Project Task unarchived';
        description = `Project Task ${parsedCurrentValues?.name} has been unarchived by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.archive
      ) {
        title = 'Collection archived';
        description = `Collection ${parsedCurrentValues?.title} has been archived by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.archive === false
      ) {
        title = 'Collection unarchived';
        description = `Collection ${parsedCurrentValues?.title} has been unarchived by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.task_pic &&
        parsedChangedValues?.is_create === true
      ) {
        title = 'Task contact person added';
        description = `Task contact person ${parsedCurrentValues?.contact_pic_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.task_member &&
        parsedChangedValues?.is_create === true
      ) {
        title = 'Task member added';
        description = `Task member ${parsedCurrentValues?.member_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.task_attachment) {
        title = 'Task attachment uploaded';
        description = `Task attachment ${parsedCurrentValues?.attachment_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.project_task_attachment) {
        title = 'Project task attachment uploaded';
        description = `Project task attachment ${parsedCurrentValues?.attachment_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task_pic &&
        parsedChangedValues?.is_create === true
      ) {
        title = 'Project task contact person added';
        description = `Project task contact person ${parsedCurrentValues?.contact_pic_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task_member &&
        parsedChangedValues?.is_create === true
      ) {
        title = 'Project task member added';
        description = `Project task member ${parsedCurrentValues?.member_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.collection_pic) {
        title = 'Collection contact person added';
        description = `Collection contact person ${parsedCurrentValues?.contact_pic_name} has been added to ${parsedCurrentValues?.title} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.collector_member) {
        title = 'Collection member added';
        description = `Collection member ${parsedCurrentValues?.member_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.collector_team) {
        title = 'Collection team added';
        description = `Collection team ${parsedCurrentValues?.team_name} has been added to ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection_payment &&
        parsedChangedValues?.uploaded_payment
      ) {
        title = 'Payment proof uploaded';
        description = `Payment proof ${parsedCurrentValues?.attachment_title} has been uploaded to ${parsedCurrentValues?.title} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection_payment &&
        parsedChangedValues?.uploaded_receipt
      ) {
        title = 'Receipt uploaded';
        description = `Receipt ${parsedCurrentValues?.attachment_title} has been uploaded to ${parsedCurrentValues?.title} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection_payment &&
        parsedChangedValues?.collection_paid
      ) {
        title = 'Collection paid';
        description = `Collection ${parsedCurrentValues?.title} has been paid by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection_payment &&
        parsedChangedValues?.rejected_payment
      ) {
        title = 'Payment proof rejected';
        description = `Payment proof ${parsedCurrentValues?.attachment_title} has been rejected for ${parsedCurrentValues?.title} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.marked_paid
      ) {
        title = 'Collection marked as paid';
        description = `Collection ${parsedCurrentValues?.title} has been marked as paid by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.marked_paid === false
      ) {
        title = 'Collection marked as unpaid';
        description = `Collection ${parsedCurrentValues?.title} has been marked as unpaid by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.collection &&
        parsedChangedValues?.payment_approve
      ) {
        title = 'Payment approved';
        description = `Payment proof for collection ${parsedCurrentValues?.title} has been approved by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.dealOwner) {
        title = 'Deal owner updated';
        description = `Deal owner has been updated from ${parsedPreviousValues?.from} to ${parsedCurrentValues?.to}`;
      } else if (parsedChangedValues?.contactGroup) {
        title = 'Contact group updated';
        description = `Contact group has been updated from ${parsedPreviousValues?.from} to ${parsedCurrentValues?.to}`;
      } else if (parsedChangedValues?.spPayment) {
        title = 'Collection paid';
        description = `Collection ${parsedCurrentValues?.title} has been paid by ${parsedCurrentValues?.updated_by_name}`;
      }

      break;
    }

    case 'delete': {
      if (parsedChangedValues?.collection) {
        title = 'Collection removed';
        description = `Collection ${parsedCurrentValues?.title} has been removed by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.task) {
        title = 'Task deleted';
        description = `Task ${parsedCurrentValues?.name} has been deleted by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.project_task) {
        title = 'Project Task deleted';
        description = `Task ${parsedCurrentValues?.name} has been deleted by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.contact_pic) {
        title = 'Contact person removed';
        description = `Contact person ${parsedCurrentValues?.name} has been removed by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.task_pic) {
        title = 'Task contact person removed';
        description = `Task contact person ${parsedCurrentValues?.contact_pic_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.task_member &&
        parsedChangedValues?.is_create === false
      ) {
        title = 'Task member removed';
        description = `Task member ${parsedCurrentValues?.member_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.task_attachment) {
        title = 'Task attachment removed';
        description = `Task attachment ${parsedCurrentValues?.attachment_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task_pic &&
        parsedChangedValues?.is_create === false
      ) {
        title = 'Project Task contact person removed';
        description = `Project task contact person ${parsedCurrentValues?.contact_pic_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (
        parsedChangedValues?.project_task_member &&
        parsedChangedValues?.is_create === false
      ) {
        title = 'Project Task member removed';
        description = `Project task member ${parsedCurrentValues?.member_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.project_task_attachment) {
        title = 'Project Task attachment removed';
        description = `Project Task attachment ${parsedCurrentValues?.attachment_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.collection_pic) {
        title = 'Collection contact person removed';
        description = `Collection contact person ${parsedCurrentValues?.contact_pic_name} has been removed from ${parsedCurrentValues?.title} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.collector_member) {
        title = 'Collection member removed';
        description = `Collection member ${parsedCurrentValues?.member_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      } else if (parsedChangedValues?.collector_team) {
        title = 'Collection team removed';
        description = `Collection team ${parsedCurrentValues?.team_name} has been removed from ${parsedCurrentValues?.name} by ${parsedCurrentValues?.updated_by_name}`;
      }

      break;
    }
  }

  return { title, description };
};

export { parseContactActivity };
