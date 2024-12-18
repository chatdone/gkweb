import { ShepherdOptionsWithType } from 'react-shepherd';

import styles from './OnboardingTooltip.module.css';

export const initialSteps: ShepherdOptionsWithType[] = [
  {
    id: 'intro',
    text: "Welcome to your new Gokudos workspace! With the new layout it's easier to manage your workload",
    // classes: styles['initial-step'],
    buttons: [
      {
        type: 'next',
        text: 'Show me around',
        classes: styles['button-next'],
      },
      {
        classes: 'shepherd-button-secondary',
        text: 'Exit',
        type: 'cancel',
      },
    ],
  },
];

export const editCompanySteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#menu-button-user-dropdown',
      on: 'bottom',
    },
    advanceOn: {
      selector: '#menu-button-user-dropdown',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 300);
      });
    },
    title: 'Edit your company profile',
    text: "Let's edit your company info by clicking here",
    buttons: [],
    canClickTarget: true,
  },
  {
    attachTo: {
      element: '#menu-list-user-dropdown button:first-child',
      on: 'left',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Edit your company profile',
    text: 'Click here to proceed',
    buttons: [],
    canClickTarget: true,
  },
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-child(3)',
      on: 'right',
    },
    advanceOn: {
      selector: '#menu-button-user-dropdown',
      event: 'click',
    },
    title: 'Edit your company profile',
    text: 'Click here to proceed',
    buttons: [],
    canClickTarget: true,
  },
  {
    attachTo: {
      element: '#company-profile',
      on: 'right',
    },
    title: 'Edit your company profile',
    text: 'You can always edit your company profile here',
    canClickTarget: true,
  },
];

export const addCompanyMembersSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(2)',
      on: 'right',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(2)',
      event: 'click',
    },
    title: "Great! Let's add some teammates",
    text: 'To get the most out of GoKudos, click here invite some coworkers or teammates!',
    buttons: [],
    canClickTarget: true,
  },
  {
    attachTo: {
      element: '#add-member-button',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Inviting a teammate',
    text: 'You can add your teammate here to get started on a project',
    canClickTarget: false,
  },
  // {
  //   attachTo: {
  //     element: '#menu-button-import-member',
  //     on: 'right',
  //   },
  //   title: 'Bulk teammates invitation',
  //   text:
  //     'Having a huge team? No worries, you can upload bulk teammates here! Sounds cool?',
  //   canClickTarget: false,
  // },
];

export const addCompanyTeamSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(3)',
      on: 'right',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(3)',
      event: 'click',
    },
    title: 'Setting up team and departments',
    text: 'Having different team for each member? Click here to setup, manage, and allocate your member into your team.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-team-button',
      on: 'right',
    },
    advanceOn: {
      selector: '#add-team-button',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Adding a team',
    text: 'Click here to add a team',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Setup team by inviting member',
    text: "Let's assign some members of the team.",
  },
];

export const editCompanyTeamSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child td:last-child button',
      on: 'left',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Edit Team',
    text: 'You can always edit team information from action panel',
  },
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    advanceOn: {
      selector: 'tbody tr:first-child',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Edit team',
    text: 'Click here to view and edit your team',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-status-button',
      on: 'left',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Setting your team status',
    text: 'Determine task progression by categories work status such as pending, done, and rejected.',
    canClickTarget: false,
  },
];

export const setupPaymentDetailsSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-child(2)',
      on: 'right',
    },
    title: "Let's setup payment details",
    text: 'Click here to manage all your payment details',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-payment-method-button',
      on: 'right',
    },
    title: 'Adding a payment card',
    text: 'Here you can add a credit/debit card to subscribe a package',
    canClickTarget: false,
  },
];

export const subscriptPackageSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:last-child',
      on: 'right',
    },
    title: 'Subscribe Package',
    text: 'Click here to see how you can subscribe a package',
    buttons: [],
  },
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(4)',
      on: 'right',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(4)',
      event: 'click',
    },
    title: 'Manage company subscription',
    text: 'Click here to setup and manage your company subscription',
    buttons: [],
  },
  {
    attachTo: {
      element: '#upgrade-plan-button',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 500);
      });
    },
    title: 'Upgrade your plan to get full access',
    text: 'You can upgrade your plan here to enjoy full features on GoKudos!',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '#back-to-dashboard-button',
      on: 'right',
    },
    advanceOn: {
      selector: '#back-to-dashboard-button',
      event: 'click',
    },
    title: 'Explore more GoKudos features',
    text: "Let's go back to dashboard to explore other features",
    buttons: [],
  },
];

export const addContactGroupSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-child(2)',
      on: 'right',
    },
    title: 'CRM',
    text: 'Click here to keep your contacts in CRM and start collaborating with them in GoKudos',
    buttons: [],
  },
  {
    attachTo: {
      element: '#menu-button-add',
      on: 'left',
    },
    advanceOn: {
      selector: '#menu-button-add',
      event: 'click',
    },
    title: 'Adding a contact category',
    text: 'Click here to add contact group to categorize your contacts',
    buttons: [],
  },
  {
    attachTo: {
      element: '#menu-list-add button:first-child',
      on: 'left',
    },
    advanceOn: {
      selector: '#menu-list-add button:first-child',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Adding a contact category',
    text: 'Click here to add contact group to categorize your contacts',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Name your contact group',
    text: 'Categorize with your own preference. For example by industries, by area and etc.',
  },
];

export const addContactSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#menu-button-add',
      on: 'left',
    },
    advanceOn: {
      selector: '#menu-button-add',
      event: 'click',
    },
    title: "Add your contact's company",
    text: 'Click here to add your contact and their details',
    buttons: [],
  },
  {
    attachTo: {
      element: '#menu-list-add button:last-child',
      on: 'left',
    },
    advanceOn: {
      selector: '#menu-list-add button:last-child',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: "Add your contact's company",
    text: 'Click here to add your contact and their details',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Filling in contact details',
    text: "Now, you can add your contacts and group'em up in one step!",
  },
];

// export const contactGroupSelectSteps: ShepherdOptionsWithType[] = [
//   {
//     attachTo: {
//       element: '#search-group',
//       on: 'bottom',
//     },
//     beforeShowPromise: () => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(0);
//         }, 200);
//       });
//     },
//     title: 'Contact Group List',
//     text: 'Here is the list for your contact groups.',
//     canClickTarget: false,
//   },
// ];

export const assignContactGroupForContactSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child td:first-child .chakra-checkbox__control',
      on: 'bottom',
    },
    advanceOn: {
      selector: 'tbody tr:first-child td:first-child .chakra-checkbox__control',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 300);
      });
    },
    title: 'Shift group',
    text: 'Select a group that you desire to shift',
    buttons: [],
  },
  {
    attachTo: {
      element: '#selected-rows',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 300);
      });
    },
    title: 'Re-allocate/delete your contact',
    text: 'Here you can re-allocate selected contact(s) to your desire group or delete selected contact(s)',
    canClickTarget: false,
  },
];

export const viewContactDetailSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    title: 'View contact details',
    text: 'Click the contact to proceed',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-pic',
      on: 'right',
    },
    title: 'Adding person in charge',
    text: 'Adding person in charge of your contact here',
    canClickTarget: false,
    scrollTo: true,
  },
  {
    attachTo: {
      element: '#contact-activities',
      on: 'left',
    },
    title: 'View related activities in a glance',
    text: 'Here you can see all the activities related to this contact in a glance! Cool right?',
    canClickTarget: false,
    scrollTo: true,
  },
];

export const addInternalTaskBoardSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-child(3)',
      on: 'right',
    },
    advanceOn: {
      selector: '#sidebar-nav .chakra-accordion__item:nth-child(3)',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Tasks',
    text: 'Click here to view all your tasks',
    buttons: [],
  },
  {
    attachTo: {
      element:
        '#sidebar-nav .chakra-accordion__item:nth-child(3) .chakra-accordion__panel div[variant=ghost]:nth-child(2)',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'View internal tasks',
    text: 'Click here to see what we can do in internal task boards',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-board',
      on: 'left',
    },
    advanceOn: {
      selector: '#add-board',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add a board',
    text: 'Click here to add a board for your internal task',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Choose a task type',
    text: 'You can allocate your task board in different task type such as internal, collaboration, and personal.',
  },
];

export const addTaskBoardTeamSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    title: 'View task board',
    text: 'Click the board to proceed',
    buttons: [],
  },
  {
    attachTo: {
      element: '#empty-teams div',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 800);
      });
    },
    title: 'Add your related team',
    text: 'Click here to assign a team to complete related task! System will auto notify related person and keep them on track.',
    buttons: [],
  },
];

export const addTaskSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#add-task',
      on: 'left',
    },
    advanceOn: {
      selector: '#add-task',
      event: 'click',
    },
    title: 'Adding a task',
    text: 'Click here to add a task and start a project!',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Filling up the task details',
    text: 'Fill up the details here to start the task',
  },
];

export const addTaskStepsWithTemplate: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#menu-button-add-task',
      on: 'left',
    },
    advanceOn: {
      selector: '#menu-button-add-task',
      event: 'click',
    },
    title: 'Adding a task',
    text: 'Click here to add a task and start a project!',
    buttons: [],
  },
  {
    attachTo: {
      element: '#menu-list-add-task button:first-child',
      on: 'left',
    },
    advanceOn: {
      selector: '#menu-list-add-task button:first-child',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Create a new task',
    text: 'Click here to create a new task',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Filling up the task details',
    text: 'Fill up the details here to start the task',
  },
];

export const editTaskSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child td:last-child button',
      on: 'bottom',
    },
    advanceOn: {
      selector: 'tbody tr:first-child td:last-child button',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Tasks action',
    text: 'You can view,edit,archive and delete your task here.',
    scrollTo: true,
    canClickTarget: false,
  },
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    title: 'View task',
    text: 'Click here to view and edit the task',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content #subtasks',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Adding subtask checklist',
    text: 'You can add your subtask here to check the status of the task',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '.chakra-modal__content .chakra-modal__body #reminder',
      on: 'left',
    },
    title: 'Setup reminder',
    text: 'Always be reminded on upcoming task by setting reminder',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '.chakra-modal__content .chakra-modal__body #assignee',
      on: 'left',
    },
    title: 'Edit related member on task',
    text: 'Having more member on this task? Here you can add or remove assignee(s).',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '.chakra-modal__content .chakra-modal__body #file-management',
      on: 'left',
    },
    title: 'File management',
    text: 'Add relevant files or document into current task to prevent messed-up files/ missing files while managing task.',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '.chakra-modal__content .chakra-modal__body #discussion',
      on: 'right',
    },
    title: 'Discussion column',
    text: 'You can discuss or update the task progress here.',
    canClickTarget: false,
  },
  {
    attachTo: {
      element:
        '.chakra-modal__content .chakra-modal__header #menu-button-actions',
      on: 'bottom',
    },
    title: 'Activities of the task',
    text: 'You can choose to hide or show the activities of the task',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '.chakra-modal__content .chakra-modal__header #close',
      on: 'bottom',
    },
    advanceOn: {
      selector: '.chakra-modal__content .chakra-modal__header #close',
      event: 'click',
    },
    title: 'Next',
    text: 'Click here to proceed',
    buttons: [],
  },
];

export const taskViewModeSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#task-view-mode',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Switch task overview',
    text: 'Now you can choose to switch your task board from list to card view.',
    canClickTarget: false,
  },
];

export const taskSharedWithMeSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element:
        '#sidebar-nav .chakra-accordion__item:nth-child(3) .chakra-accordion__panel div[variant="ghost"]:last-child',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Shared with me',
    text: 'View your task that is shared by other GoKudos users.',
    canClickTarget: false,
  },
];

export const addClientCollectorSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-last-child(3)',
      on: 'right',
    },
    title: 'Collections',
    text: 'Click here to start creating collections and reminders',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-client',
      on: 'right',
    },
    advanceOn: {
      selector: '#add-client',
      event: 'click',
    },
    title: 'Add a client',
    text: 'Click here to get started by adding a client into the collection list!',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add assignee',
    text: "Let's add assignee(s)/team who is in charge of this collection",
  },
];

export const createCollectionSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: "Client's collection",
    text: 'Click here to create new collection for your client',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-collection',
      on: 'left',
    },
    advanceOn: {
      selector: '#add-collection',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Add a collection',
    text: 'Click here to add collection and keep track on it',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Filling up collection details',
    text: 'Add an attachment of invoice and fill in the details of collections.',
  },
];

export const viewCollectionSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child td:last-child button',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Collection action',
    text: 'You can view, edit, archive and delete your collection here',
    scrollTo: true,
    canClickTarget: false,
  },
  {
    attachTo: { element: 'tbody tr:first-child', on: 'bottom' },
    title: 'View Collection',
    text: 'Click here to view the details of your collection',
    buttons: [],
  },
  {
    attachTo: { element: '#card-tabs', on: 'right' },
    title: 'Accept or reject payment status',
    text: 'Here you can accept or reject the payment proof.',
    canClickTarget: false,
  },
];

export const collectionListViewTypeAndStatusSortingSteps: ShepherdOptionsWithType[] =
  [
    {
      attachTo: { element: '#breadcrumb div:nth-child(3) a', on: 'bottom' },
      title: 'View client',
      text: "Click here to go back to the client's collection list",
      buttons: [],
    },
    {
      attachTo: { element: '#view-draft', on: 'bottom' },
      beforeShowPromise: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(0);
          }, 800);
        });
      },
      title: 'View draft',
      text: "Half way adding your collection? it's alright! You can always save as draft and publish your collection anytime!",
      canClickTarget: false,
    },
    {
      attachTo: { element: '#view-archived', on: 'bottom' },
      title: 'View archived',
      text: "Don't want to delete your unwanted collection but want to remove from the list? Here you can archive and store into the archive folder.",
      canClickTarget: false,
    },
    {
      attachTo: { element: '#collection-summary', on: 'left' },
      title: 'Summary sorting',
      text: 'Want to view certain status in a glance? You can filter by clicking the status of the summary such as pending, overdue and paid.',
      canClickTarget: false,
    },
  ];

export const paymentsPageSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-last-child(2)',
      on: 'right',
    },
    title: 'Payments',
    text: 'Click here to view your payments',
    buttons: [],
  },
  {
    attachTo: {
      element: '#collection-summary',
      on: 'left',
    },
    title: 'Summary sorting',
    text: 'Want to view certain status in a glance? You can filter by clicking the status of the summary such as pending, overdue and paid.',
    canClickTarget: false,
  },
];

export const paymentsCollectionSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    title: 'Payments',
    text: "Click here to view your collector's payments",
    buttons: [],
  },
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Payments',
    text: 'Click here to view your payments',
    buttons: [],
  },
  {
    attachTo: {
      element: '#payments',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Upload payment slip',
    text: 'Upload your payment slip record here to keep your payment on track',
    canClickTarget: false,
  },
];

export const createProjectSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-child(4)',
      on: 'right',
    },
    advanceOn: {
      selector: '#sidebar-nav .chakra-accordion__item:nth-child(4)',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Project Management',
    text: 'Click here to view all your projects',
    buttons: [],
  },
  {
    attachTo: {
      element:
        '#sidebar-nav .chakra-accordion__item:nth-child(4) .chakra-accordion__panel div[variant=ghost]:nth-child(2)',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Go to Project Tracker',
    text: 'Start your project with project tracker.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-project',
      on: 'left',
    },
    title: 'Add project',
    text: 'Click here to add project.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add project here',
    text: 'You can add project details here.',
  },
];

export const addProjectTeamSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    title: 'View project',
    text: 'Click here to view project.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#empty-teams div',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 800);
      });
    },
    title: 'Add a team',
    text: 'Add a team to continue.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Select a team',
    text: 'You can select a team here or go to company settingto setup a team.',
  },
];

export const createProjectTaskSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#add-task',
      on: 'left',
    },
    title: 'Add project task',
    text: 'Click here to add project task.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add project task here',
    text: 'You can add project details here',
  },
];

export const editProjectTaskSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    title: 'Check or edit project task',
    text: 'Click here to check or edit project task progress.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content #time-tracker',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Project time tracker',
    text: 'Click here to start track on your project time effort.',
    canClickTarget: false,
  },
];

export const ganttChartSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element:
        '#sidebar-nav .chakra-accordion__item:nth-child(4) .chakra-accordion__panel div[variant=ghost]:nth-child(1)',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Go to Gantt Chart',
    text: 'Gantt chart allow you to have a quick look on the project status',
    buttons: [],
  },
  {
    attachTo: {
      element: '#calendar_view',
      on: 'left',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Calendar View',
    text: 'This is calendar view',
    canClickTarget: false,
    modalOverlayOpeningPadding: 5,
  },
  {
    attachTo: {
      element: '.rbc-btn-group:last-child',
      on: 'bottom',
    },
    title: 'Switch View',
    text: 'You can switch view between monthly view or agenda view here',
    canClickTarget: false,
    modalOverlayOpeningPadding: 5,
  },
  {
    attachTo: {
      element: '#chart_view',
      on: 'left',
    },
    title: 'Chart View',
    text: 'Click here to view as chart view.',
    modalOverlayOpeningPadding: 5,
    buttons: [],
  },
  {
    attachTo: {
      element: '#add_task_project',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add project task',
    text: 'Click here to add project task.',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '#view_by_group',
      on: 'left',
    },
    title: 'Switch view',
    text: 'Click here to view by different category.',
    canClickTarget: false,
    modalOverlayOpeningPadding: 5,
  },
  {
    attachTo: {
      element: '#list_view',
      on: 'left',
    },
    title: 'List View',
    text: 'Click here to view as list view.',
    modalOverlayOpeningPadding: 5,
    buttons: [],
  },
  {
    attachTo: {
      element: '#add_task_project',
      on: 'bottom',
    },
    title: 'Add project task',
    text: 'Click here to add project task.',
    canClickTarget: false,
  },
];

export const attendanceClockInSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-child(5)',
      on: 'right',
    },
    title: 'Go to Attendance',
    text: 'Attendance allow you to have a quick look on attendance status',
    buttons: [],
  },
  {
    attachTo: {
      element: '#clock_in',
      on: 'bottom',
    },
    advanceOn: {
      selector: '#clock_in',
      event: 'click',
    },
    title: 'Click in here',
    text: 'You can clock in your activity here.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add your activity here',
    text: 'You can record your activity here.',
  },
];

export const attendanceDetailsSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    advanceOn: {
      selector: 'tbody tr:first-child',
      event: 'click',
    },
    title: 'View attendance',
    text: 'Click here to view attendance details.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#back_to_list',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Back to list',
    text: 'Click here back to the list view.',
    canClickTarget: false,
    modalOverlayOpeningPadding: 5,
  },
];

export const companyPolicySteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:last-child',
      on: 'right',
    },
    title: 'Go to Time Attendance',
    text: 'Set your company time attendance setting here.',
    buttons: [],
  },
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(1)',
      on: 'bottom',
    },
    title: 'Setup company attendance policy',
    text: 'You can setup attendance verification methods and devices for members.',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '#device-restrictions',
      on: 'bottom',
    },
    title: 'Setup attendance devices here',
    text: 'Choose to allow Mobile Apps, Web Browser or both for members to clock attendance.',
    canClickTarget: false,
  },
  {
    attachTo: {
      element: '#verification-requirements',
      on: 'top',
    },
    title: 'Setup verification requirements',
    text: 'Choose the required verification method such as facial recognition, biometric, and location.',
    canClickTarget: false,
  },
];

export const companyHolidaySteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(2)',
      on: 'bottom',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(2)',
      event: 'click',
    },
    title: "Setup company's calendar",
    text: 'You can setup company holidays via the calendar here.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-holiday',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add custom holiday',
    text: 'You can add your company holiday schedule here.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Setup holiday',
    text: 'You can add your company holiday.',
  },
];

export const companyLocationSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(3)',
      on: 'bottom',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(3)',
      event: 'click',
    },
    title: "Setup company's location",
    text: "You can setup company's Headquarters, branches, retails and any location.",
    buttons: [],
  },
  {
    attachTo: {
      element: '#google-map-search-bar',
      on: 'bottom',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Search your company location',
    text: 'You can type your company address or search by company name here',
    buttons: [],
  },
];

export const companySelectLocationSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#google-map-search-bar',
      on: 'left',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Select location',
    text: 'Key in your location here',
    buttons: [],
  },
];

export const companyAddLocationSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#add-location',
      on: 'bottom',
    },
    title: 'Add location',
    text: 'Click here to add and rename the location',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Setup holiday',
    text: 'You can add your company holiday.',
  },
];

export const companyActivityLabelSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(4)',
      on: 'bottom',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(4)',
      event: 'click',
    },
    title: 'Setup company activities here',
    text: 'You can setup company activities for members to log in their daily entries.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-label',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add label here',
    text: 'You can add your company activity label here.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Setup activity label',
    text: 'You can customize your label here.',
    buttons: [],
  },
  {
    attachTo: {
      element: 'tbody tr:first-child td:last-child button',
      on: 'bottom',
    },
    title: 'Edit label',
    text: 'You can edit your activity label here. To be remind once you edit the label, all the related label will be changed.',
    canClickTarget: false,
  },
];

export const createEmployeeTypeSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#sidebar-nav .chakra-accordion__item:nth-last-child(2)',
      on: 'right',
    },
    title: 'Go to company setting',
    text: 'Set your company setting here.',
    buttons: [],
  },
  {
    attachTo: {
      element: '[role="tablist"] button:last-child',
      on: 'bottom',
    },
    advanceOn: {
      selector: '[role="tablist"] button:last-child',
      event: 'click',
    },
    title: 'Setup your company work schedule',
    text: 'You can setup company work schedule and categories as Full Time, Part Time and etc.',
    buttons: [],
  },
  {
    attachTo: {
      element: '#add-employee-type',
      on: 'bottom',
    },
    advanceOn: {
      selector: '#add-employee-type',
      event: 'click',
    },
    title: 'Add category',
    text: 'Click here to add category.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Add employee type name',
    text: 'Add your company employee type to categorize working schedule such as Full Time, Part Time and etc.',
  },
];

export const editEmployeeTypeSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '#edit-schedule',
      on: 'right',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 400);
      });
    },
    title: 'Edit to fit your schedule',
    text: 'Edit your working hour here.',
    canClickTarget: false,
  },
];

export const setCompanyMemberEmployeeTypeSteps: ShepherdOptionsWithType[] = [
  {
    attachTo: {
      element: '[role="tablist"] button:nth-child(2)',
      on: 'bottom',
    },
    advanceOn: {
      selector: '[role="tablist"] button:nth-child(2)',
      event: 'click',
    },
    title: 'Go to member',
    text: 'To setup the employee type of the member',
    buttons: [],
  },
  {
    attachTo: {
      element: 'tbody tr:first-child',
      on: 'bottom',
    },
    advanceOn: {
      selector: 'tbody tr:first-child',
      event: 'click',
    },
    title: 'Select a member to proceed',
    text: 'Click a member that you wish to change employee type.',
    buttons: [],
  },
  {
    attachTo: {
      element: '.chakra-modal__content',
      on: 'right-end',
    },
    advanceOn: {
      selector: '.chakra-modal__content',
      event: 'click',
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    title: 'Select Employee Type',
    text: 'Select employee type that had been setup in work schedule.',
  },
];
