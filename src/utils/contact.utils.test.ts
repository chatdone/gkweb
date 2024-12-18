import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { describe, test, beforeEach } from 'vitest';

import { parseContactActivity } from './contact.utils';

import { ContactType } from 'generated/graphql-types';

describe('parseContactActivity', () => {
  let fakeName: string;
  let fakeActionByName: string;
  let fakeTitle: string;

  const dateTimeFormat = 'LT, DD MMM, YYYY';

  beforeEach(() => {
    fakeName = faker.name.findName();
    fakeActionByName = faker.name.findName();
    fakeTitle = faker.random.words();
  });

  describe('should show correct message data from create action', () => {
    test('collection created', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          collection: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          created_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Collection created',
        description: `Collection ${fakeTitle} has been created by ${fakeActionByName}`,
      });
    });

    test('collection created', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          spPayment: true,
          title: fakeTitle,
        }),
        currentValues: '{}',
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Collection created',
        description: `Collection ${fakeTitle} has been created`,
      });
    });

    test('task created', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          task: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          created_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Task created',
        description: `Task ${fakeTitle} has been created by ${fakeActionByName}`,
      });
    });

    test('project task created', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          project_task: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          created_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Project Task created',
        description: `Task ${fakeTitle} has been created by ${fakeActionByName}`,
      });
    });

    test('contact created', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          contact: true,
        }),
        currentValues: JSON.stringify({
          name: fakeName,
          created_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Contact created',
        description: `Contact ${fakeName} has been created by ${fakeActionByName}`,
      });
    });

    test('contact pic created', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          contact_pic: true,
        }),
        currentValues: JSON.stringify({
          name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Contact person created',
        description: `Contact person ${fakeName} has been added by ${fakeActionByName}`,
      });
    });

    test('deal owner added', () => {
      const message = parseContactActivity({
        action: 'create',
        changedValues: JSON.stringify({
          dealOwner: true,
          updatedByName: fakeActionByName,
        }),
        currentValues: JSON.stringify({
          to: fakeName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Deal Owner added',
        description: `${fakeActionByName} has changed deal owner to ${fakeName}`,
      });
    });
  });

  describe('should show correct message data from update action', () => {
    test('task set due date', () => {
      const dueDate = faker.date.future();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task: true,
          due_date: dueDate,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
          due_date: dueDate,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Task updated',
        description: `Due date for task ${fakeTitle} has been updated to ${dayjs(
          dueDate,
        ).format(dateTimeFormat)} by ${fakeActionByName}`,
      });
    });

    test('task update due date', () => {
      const oldDueDate = faker.date.recent();
      const newDueDate = faker.date.soon();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task: true,
          due_date: oldDueDate,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
          due_date: newDueDate,
        }),
        previousValues: JSON.stringify({
          due_date: oldDueDate,
        }),
      });

      expect(message).toEqual({
        title: 'Task updated',
        description: `Due date for task ${fakeTitle} has been updated from ${dayjs(
          oldDueDate,
        ).format(dateTimeFormat)} to ${dayjs(newDueDate).format(
          dateTimeFormat,
        )}`,
      });
    });

    test('project task update estimated timeline', () => {
      const oldStartDate = faker.date.recent();
      const oldEndDate = faker.date.soon();
      const newStartDate = faker.date.recent();
      const newEndDate = faker.date.soon();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task: true,
          start_date: newStartDate,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
          start_date: newStartDate,
          end_date: newEndDate,
        }),
        previousValues: JSON.stringify({
          start_date: oldStartDate,
          end_date: oldEndDate,
        }),
      });

      expect(message).toEqual({
        title: 'Project task updated',
        description: `Targeted date for project task ${fakeTitle} has been updated from ${dayjs(
          oldStartDate,
        ).format('LL')} - ${dayjs(oldEndDate).format('LL')} to ${dayjs(
          newStartDate,
        ).format('LL')} - ${dayjs(newEndDate).format(
          'LL',
        )} by ${fakeActionByName}`,
      });
    });

    test('task update status', () => {
      const oldLabel = faker.random.word();
      const newLabel = faker.random.word();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task: true,
          company_team_status: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
          label: newLabel,
        }),
        previousValues: JSON.stringify({
          label: oldLabel,
        }),
      });

      expect(message).toEqual({
        title: 'Task updated',
        description: `Status for task ${fakeTitle} has been updated from ${oldLabel} to ${newLabel} by ${fakeActionByName}`,
      });
    });

    test('project task update status', () => {
      const oldLabel = faker.random.word();
      const newLabel = faker.random.word();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task: true,
          company_team_status: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
          label: newLabel,
        }),
        previousValues: JSON.stringify({
          label: oldLabel,
        }),
      });

      expect(message).toEqual({
        title: 'Project Task updated',
        description: `Status for project task ${fakeTitle} has been updated from ${oldLabel} to ${newLabel} by ${fakeActionByName}`,
      });
    });

    test('collection set due date', () => {
      const dueDate = faker.date.soon();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          due_date: dueDate,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
          due_date: dueDate,
        }),
        previousValues: JSON.stringify({
          due_date: null,
        }),
      });

      expect(message).toEqual({
        title: 'Collection updated',
        description: `Due date for collection ${fakeTitle} has been set to ${dayjs(
          dueDate,
        ).format('DD MMM, YYYY')} by ${fakeActionByName}`,
      });
    });

    test('collection update due date', () => {
      const oloDueDate = faker.date.recent();
      const newDueDate = faker.date.soon();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          due_date: newDueDate,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
          due_date: newDueDate,
        }),
        previousValues: JSON.stringify({
          due_date: oloDueDate,
        }),
      });

      expect(message).toEqual({
        title: 'Collection updated',
        description: `Due date for collection ${fakeTitle} has been updated from ${dayjs(
          oloDueDate,
        ).format('DD MMM, YYYY')} to ${dayjs(newDueDate).format(
          'DD MMM, YYYY',
        )} by ${fakeActionByName}`,
      });
    });

    test('collection update title', () => {
      const oldTitle = faker.random.words();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          title: fakeTitle,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          title: oldTitle,
        }),
      });

      expect(message).toEqual({
        title: 'Collection updated',
        description: `Title for collection ${oldTitle} has been updated to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection update ref no', () => {
      const oldRefNo = faker.random.alphaNumeric(5);
      const newRefNo = faker.random.alphaNumeric(5);

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          ref_no: newRefNo,
        }),
        currentValues: JSON.stringify({
          ref_no: newRefNo,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          title: fakeTitle,
          ref_no: oldRefNo,
        }),
      });

      expect(message).toEqual({
        title: 'Collection updated',
        description: `Invoice number for collection ${fakeTitle} has been updated from ${oldRefNo} to ${newRefNo} by ${fakeActionByName}`,
      });
    });

    test('contact update name', () => {
      const oldName = faker.name.findName();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact: true,
          name: fakeName,
        }),
        currentValues: JSON.stringify({
          name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          name: oldName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact updated',
        description: `Title for contact ${oldName} has been updated to ${fakeName} by ${fakeActionByName}`,
      });
    });

    test('contact update type', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact: true,
          type: ContactType.Company,
        }),
        currentValues: JSON.stringify({
          type: ContactType.Company,
        }),
        previousValues: JSON.stringify({
          name: fakeName,
          type: ContactType.Individual,
        }),
      });

      expect(message).toEqual({
        title: 'Contact updated',
        description: `Type for contact ${fakeName} has been updated from PERSONAL to COMPANY`,
      });
    });

    test('contact update address', () => {
      const address = faker.address.streetAddress(true);

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact: true,
          address,
        }),
        currentValues: JSON.stringify({
          address,
        }),
        previousValues: JSON.stringify({
          name: fakeName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact updated',
        description: `Address for contact ${fakeName} has been updated to ${address}`,
      });
    });

    test('contact pic update name', () => {
      const oldName = faker.name.findName();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact: true,
          contact_pic_name: fakeName,
        }),
        currentValues: JSON.stringify({
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          contact_pic_name: oldName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact person updated',
        description: `Contact person name ${oldName} has been updated to ${fakeName} by ${fakeActionByName}`,
      });
    });

    test('contact pic set contact no', () => {
      const contactNo = faker.phone.phoneNumber();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact_no: contactNo,
        }),
        currentValues: JSON.stringify({
          contact_no: contactNo,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          contact_pic_name: fakeName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact person updated',
        description: `Phone number for contact person ${fakeName} has been set to ${contactNo} by ${fakeActionByName}`,
      });
    });

    test('contact pic update contact no', () => {
      const oldContactNo = faker.phone.phoneNumber();
      const newContactNo = faker.phone.phoneNumber();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact_no: newContactNo,
        }),
        currentValues: JSON.stringify({
          contact_no: newContactNo,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          contact_no: oldContactNo,
          contact_pic_name: fakeName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact person updated',
        description: `Phone number for contact person ${fakeName} has been updated from ${oldContactNo} to ${newContactNo} by ${fakeActionByName}`,
      });
    });

    test('contact pic update name and contact no', () => {
      const oldName = faker.name.findName();
      const oldContactNo = faker.phone.phoneNumber();
      const newContactNo = faker.phone.phoneNumber();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contact_no: newContactNo,
          contact_pic_name: fakeName,
        }),
        currentValues: JSON.stringify({
          contact_no: newContactNo,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({
          contact_no: oldContactNo,
          contact_pic_name: oldName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact person updated',
        description: `Contact person name and phone number ${oldName}(${oldContactNo}) has been updated to ${fakeName}(${newContactNo}) by ${fakeActionByName}`,
      });
    });

    test('task archived', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task: true,
          archive: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Task archived',
        description: `Task ${fakeTitle} has been archived by ${fakeActionByName}`,
      });
    });

    test('project task archived', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task: true,
          archive: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Project Task archived',
        description: `Project Task ${fakeTitle} has been archived by ${fakeActionByName}`,
      });
    });

    test('task unarchived', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task: true,
          archive: false,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Task unarchived',
        description: `Task ${fakeTitle} has been unarchived by ${fakeActionByName}`,
      });
    });

    test('project task unarchived', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task: true,
          archive: false,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Project Task unarchived',
        description: `Project Task ${fakeTitle} has been unarchived by ${fakeActionByName}`,
      });
    });

    test('collection archived', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          archive: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection archived',
        description: `Collection ${fakeTitle} has been archived by ${fakeActionByName}`,
      });
    });

    test('collection unarchived', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          archive: false,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection unarchived',
        description: `Collection ${fakeTitle} has been unarchived by ${fakeActionByName}`,
      });
    });

    test('task add pic', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task_pic: true,
          is_create: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Task contact person added',
        description: `Task contact person ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('task add member', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task_member: true,
          is_create: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Task member added',
        description: `Task member ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('task upload attachment', () => {
      const taskTitle = faker.random.words();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          task_attachment: true,
        }),
        currentValues: JSON.stringify({
          attachment_name: fakeTitle,
          name: taskTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Task attachment uploaded',
        description: `Task attachment ${fakeTitle} has been added to ${taskTitle} by ${fakeActionByName}`,
      });
    });

    test('project task upload attachment', () => {
      const taskTitle = faker.random.words();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task_attachment: true,
        }),
        currentValues: JSON.stringify({
          attachment_name: fakeTitle,
          name: taskTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Project task attachment uploaded',
        description: `Project task attachment ${fakeTitle} has been added to ${taskTitle} by ${fakeActionByName}`,
      });
    });

    test('project task add pic', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task_pic: true,
          is_create: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Project task contact person added',
        description: `Project task contact person ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('project task add member', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          project_task_member: true,
          is_create: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Project task member added',
        description: `Project task member ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection add pic', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection_pic: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection contact person added',
        description: `Collection contact person ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection add member', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collector_member: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection member added',
        description: `Collection member ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection add member', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collector_member: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection member added',
        description: `Collection member ${fakeName} has been added to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collector add collection team', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collector_team: true,
        }),
        currentValues: JSON.stringify({
          name: fakeName,
          team_name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection team added',
        description: `Collection team ${fakeTitle} has been added to ${fakeName} by ${fakeActionByName}`,
      });
    });

    test('collection upload payment proof', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection_payment: true,
          uploaded_payment: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          attachment_title: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Payment proof uploaded',
        description: `Payment proof ${fakeName} has been uploaded to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection upload receipt', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection_payment: true,
          uploaded_receipt: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          attachment_title: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Receipt uploaded',
        description: `Receipt ${fakeName} has been uploaded to ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection paid', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection_payment: true,
          collection_paid: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection paid',
        description: `Collection ${fakeTitle} has been paid by ${fakeActionByName}`,
      });
    });

    test('collection payment proof rejected', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection_payment: true,
          rejected_payment: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          attachment_title: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Payment proof rejected',
        description: `Payment proof ${fakeName} has been rejected for ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection mark as paid', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          marked_paid: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection marked as paid',
        description: `Collection ${fakeTitle} has been marked as paid by ${fakeActionByName}`,
      });
    });

    test('collection mark as unpaid', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          marked_paid: false,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection marked as unpaid',
        description: `Collection ${fakeTitle} has been marked as unpaid by ${fakeActionByName}`,
      });
    });

    test('collection approve payment proof', () => {
      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          collection: true,
          payment_approve: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Payment approved',
        description: `Payment proof for collection ${fakeTitle} has been approved by ${fakeActionByName}`,
      });
    });

    test('update deal owner', () => {
      const oldName = faker.name.findName();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          dealOwner: true,
        }),
        currentValues: JSON.stringify({
          to: fakeName,
        }),
        previousValues: JSON.stringify({
          from: oldName,
        }),
      });

      expect(message).toEqual({
        title: 'Deal owner updated',
        description: `Deal owner has been updated from ${oldName} to ${fakeName}`,
      });
    });

    test('update contact group', () => {
      const oldName = faker.name.findName();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          contactGroup: true,
        }),
        currentValues: JSON.stringify({
          to: fakeName,
        }),
        previousValues: JSON.stringify({
          from: oldName,
        }),
      });

      expect(message).toEqual({
        title: 'Contact group updated',
        description: `Contact group has been updated from ${oldName} to ${fakeName}`,
      });
    });

    test('senangpay payment paid', () => {
      const oldName = faker.name.findName();

      const message = parseContactActivity({
        action: 'update',
        changedValues: JSON.stringify({
          spPayment: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: JSON.stringify({}),
      });

      expect(message).toEqual({
        title: 'Collection paid',
        description: `Collection ${fakeTitle} has been paid by ${fakeActionByName}`,
      });
    });
  });

  describe('should show correct message data from delete action', () => {
    test('collection deleted', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          collection: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Collection removed',
        description: `Collection ${fakeTitle} has been removed by ${fakeActionByName}`,
      });
    });

    test('task deleted', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          task: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Task deleted',
        description: `Task ${fakeTitle} has been deleted by ${fakeActionByName}`,
      });
    });

    test('project task deleted', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          project_task: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Project Task deleted',
        description: `Task ${fakeTitle} has been deleted by ${fakeActionByName}`,
      });
    });

    test('contact remove pic', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          contact_pic: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Contact person removed',
        description: `Contact person ${fakeTitle} has been removed by ${fakeActionByName}`,
      });
    });

    test('task remove pic', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          task_pic: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Task contact person removed',
        description: `Task contact person ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('task remove member', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          task_member: true,
          is_create: false,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Task member removed',
        description: `Task member ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('task remove attachment', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          task_attachment: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          attachment_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Task attachment removed',
        description: `Task attachment ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('project task remove pic', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          project_task_pic: true,
          is_create: false,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Project Task contact person removed',
        description: `Project task contact person ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('project task remove member', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          project_task_member: true,
          is_create: false,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Project Task member removed',
        description: `Project task member ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('project task remove attachment', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          project_task_attachment: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          attachment_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Project Task attachment removed',
        description: `Project Task attachment ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection remove pic', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          collection_pic: true,
        }),
        currentValues: JSON.stringify({
          title: fakeTitle,
          contact_pic_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Collection contact person removed',
        description: `Collection contact person ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection remove member', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          collector_member: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          member_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Collection member removed',
        description: `Collection member ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });

    test('collection remove team', () => {
      const message = parseContactActivity({
        action: 'delete',
        changedValues: JSON.stringify({
          collector_team: true,
        }),
        currentValues: JSON.stringify({
          name: fakeTitle,
          team_name: fakeName,
          updated_by_name: fakeActionByName,
        }),
        previousValues: '{}',
      });

      expect(message).toEqual({
        title: 'Collection team removed',
        description: `Collection team ${fakeName} has been removed from ${fakeTitle} by ${fakeActionByName}`,
      });
    });
  });
});
