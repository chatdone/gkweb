import { DATE_LIST, MONTH_LIST } from './date.constants';

import {
  ProjectGroupCustomAttributeType,
  TaskPriorityType,
} from 'generated/graphql-types';

const TASK_ATTACHMENT_ACCEPT_TYPE =
  '.png, .jpg, .jpeg, .heic, .pdf, .docx, .pptx, .xlsx, .xls, .csv, video/*';

const TASK_NAME_MAX_LENGTH = 150;

const taskRecurringDayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

/**
 * These are color types, actual color display will be handled by css,
 * @see /src/components/AppLayout/TaskSubNav/EditWorkspace.module.less
 * @see /src/css/components.less
 */
const WORKSPACE_COLORS = [
  'red',
  'blue',
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
];

const TASK_PRIORITY_COLORS = {
  [TaskPriorityType.High]: 'red',
  [TaskPriorityType.Medium]: 'gold',
  [TaskPriorityType.Low]: 'lime',
};

const TASK_RECURRING_CASCADER_OPTIONS = [
  {
    label: 'Daily',
    value: 'DAILY',
    children: [
      {
        label: 'Everyday',
        value: 'everyday',
      },
      {
        label: 'Working day only',
        value: 'working_day',
      },
    ],
  },
  {
    label: 'Weekly',
    value: 'WEEKLY',
    children: taskRecurringDayOptions,
  },
  {
    label: '1st Week',
    value: 'FIRST_WEEK',
    children: taskRecurringDayOptions,
  },
  {
    label: '2nd Week',
    value: 'SECOND_WEEK',
    children: taskRecurringDayOptions,
  },
  {
    label: '3rd Week',
    value: 'THIRD_WEEK',
    children: taskRecurringDayOptions,
  },
  {
    label: '4th Week',
    value: 'FOURTH_WEEK',
    children: taskRecurringDayOptions,
  },
  {
    label: 'Monthly',
    value: 'MONTHLY',
    children: DATE_LIST,
  },
  {
    label: 'Yearly',
    value: 'YEARLY',
    children: MONTH_LIST.map((item) => ({
      ...item,
      children: DATE_LIST,
    })),
  },
];

const TASK_PROPERTY_OPTIONS = [
  {
    label: 'Due date',
    value: 'timeline',
    tooltip: 'Due date(s) of the task',
  },
  {
    label: 'Assignee',
    value: 'assignee',
    tooltip: 'People who work on the task',
  },
  {
    label: 'Watchers',
    value: 'watchers',
    tooltip: 'People who get notified',
  },
  {
    label: 'Contacts',
    value: 'contacts',
    tooltip: 'External party who work on the task',
  },
  {
    label: 'Tracking',
    value: 'tracking',
    tooltip: 'Able to track time working on the task',
  },
  {
    label: 'Priority',
    value: 'priority',
    tooltip: 'Set priority for the task',
  },
  {
    label: 'Tags',
    value: 'tags',
    tooltip: 'Add tags to the task',
  },
  {
    label: 'Value',
    value: 'value',
    tooltip: 'Estimated cost for the task',
  },
  {
    label: 'Effort',
    value: 'effort',
    tooltip: 'Estimated effort in hour for the task',
  },
  {
    label: 'Reminder',
    value: 'reminder',
    tooltip: 'Set a task reminder before due date',
  },
  {
    label: 'Recurrence',
    value: 'recurrence',
    tooltip: 'Create recurring task',
  },
];

const DEFAULT_PROJECT_TEMPLATES_GALLERY = [
  {
    name: 'Team',
    key: 'team',
    templates: [
      {
        name: 'Minutes',
        title: 'Minutes: Add a Topic',
        groups: [
          {
            name: 'Action Items',
            tasks: ['Task 1', 'Task 2'],
          },
          {
            name: 'Discussion',
            tasks: ['Topic 1', 'Topic 2'],
          },
          {
            name: 'References',
            tasks: ['Source 1', 'Source 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
      {
        name: 'Brainstorm',
        title: 'Brainstorm: Add a Topic',
        groups: [
          {
            name: 'Goals',
            tasks: ['Goal 1', 'Goal 2'],
          },
          {
            name: 'Inspiration',
            tasks: ['Inspiration 1', 'Inspiration 2'],
          },
          {
            name: 'Ideas',
            tasks: ['Idea 1', 'Idea 2'],
          },
          {
            name: 'Next Steps',
            tasks: ['Plan 1', 'Plan 2'],
          },
        ],
        status: ['Avoid', 'Consider', 'Shortlist', 'Proceed'],
        fields: ['Assignee'],
        customFields: [],
      },
      {
        name: 'Weekly Updates (PPP)',
        title: 'PPP: #year Week #number',
        groups: [
          {
            name: 'Plans',
            tasks: ['Plan 1', 'Plan 2'],
          },
          {
            name: 'Progress',
            tasks: ['Progress 1', 'Progress 2'],
          },
          {
            name: 'Problems',
            tasks: ['Problem 1', 'Problem 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
      {
        name: 'Quarterly Review (OKR)',
        title: 'OKR: #year Q#number',
        groups: [
          {
            name: 'Objectives',
            tasks: ['Objective 1', 'Objective 2'],
          },
          {
            name: 'Key Results',
            tasks: ['Key Result 1', 'Key Result 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee'],
        customFields: [
          { name: 'Results', type: ProjectGroupCustomAttributeType.Number },
        ],
      },
      {
        name: 'Project Product Plan',
        title: 'Plan: Add a Project/Product Name',
        groups: [
          {
            name: 'Objectives',
            tasks: ['Objective 1', 'Objective 2'],
          },
          {
            name: 'Milestones',
            tasks: ['Milestone 1', 'Milestone 2'],
          },
          {
            name: 'Budget',
            tasks: ['Budget 1', 'Budget 2'],
          },
          {
            name: 'Appendix',
            tasks: ['Appendix 1', 'Appendix 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Budget value'],
        customFields: [],
      },
    ],
  },
  {
    name: 'Personal',
    key: 'personal',
    templates: [
      {
        name: 'Weekly Planner',
        title: 'Plan: #year Week #number',
        groups: [
          {
            name: 'Monday',
            tasks: ['Todo 1', 'Todo 2'],
          },
          {
            name: 'Tuesday',
            tasks: ['Todo 1', 'Todo 2'],
          },
          {
            name: 'Wednesday',
            tasks: ['Todo 1', 'Todo 2'],
          },
          {
            name: 'Thursday',
            tasks: ['Todo 1', 'Todo 2'],
          },
          {
            name: 'Friday',
            tasks: ['Todo 1', 'Todo 2'],
          },
          {
            name: 'Saturday',
            tasks: ['Todo 1', 'Todo 2'],
          },
          {
            name: 'Sunday',
            tasks: ['Todo 1', 'Todo 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Priority'],
        customFields: [],
      },
      {
        name: 'Weekly Expenses',
        title: 'Plan: #year Week #number',
        groups: [
          {
            name: 'Monday',
            tasks: ['Food', 'Wellness'],
          },
          {
            name: 'Tuesday',
            tasks: ['Food', 'Wellness'],
          },
          {
            name: 'Wednesday',
            tasks: ['Food', 'Wellness'],
          },
          {
            name: 'Thursday',
            tasks: ['Food', 'Wellness'],
          },
          {
            name: 'Friday',
            tasks: ['Food', 'Wellness'],
          },
          {
            name: 'Saturday',
            tasks: ['Food', 'Wellness'],
          },
          {
            name: 'Sunday',
            tasks: ['Food', 'Wellness'],
          },
        ],
        status: ['Needs', 'Wants'],
        fields: ['Budget value', 'Actual value'],
        customFields: [],
      },
    ],
  },
  {
    name: 'Creative',
    key: 'creative',
    templates: [
      {
        name: 'Creative Brief',
        title: 'Creative Brief: Add a Project Name',
        groups: [
          {
            name: 'Description',
            tasks: ['Intro 1', 'Intro 2'],
          },
          {
            name: 'Objectives',
            tasks: ['Objective 1', 'Objective 2'],
          },
          {
            name: 'Audience',
            tasks: ['Audience 1', 'Audience 2'],
          },
          {
            name: 'Messaging',
            tasks: ['Look and feel', 'Tone'],
          },
          {
            name: 'Deliverables',
            tasks: ['Deliverable 1', 'Deliverable 2'],
          },
          {
            name: 'Budget',
            tasks: ['Budget 1', 'Budget 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: [
          'Due Date',
          'Assignee',
          'Priority',
          'Budget value',
          'Targeted hours',
        ],
        customFields: [],
      },
      {
        name: 'Production Plan',
        title: 'Production Plan: Add a Project Name',
        groups: [
          {
            name: 'Overview',
            tasks: ['Intro 1', 'Intro 2'],
          },
          {
            name: 'Mood Board',
            tasks: ['Sample 1', 'Sample 2'],
          },
          {
            name: 'Budget',
            tasks: ['Budget 1', 'Budget 2'],
          },
          {
            name: 'Script',
            tasks: ['Script 1', 'Script 2'],
          },
          {
            name: 'Storyboard',
            tasks: ['Scene 1', 'Scene 2'],
          },
          {
            name: 'Music',
            tasks: ['Music 1', 'Music 2'],
          },
          {
            name: 'Footages',
            tasks: ['Video 1', 'Video 2'],
          },
          {
            name: 'Rough Cuts',
            tasks: ['Version 1', 'Version 2'],
          },
          {
            name: 'Final',
            tasks: ['Final'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: [
          'Due Date',
          'Assignee',
          'Priority',
          'Budget value',
          'Targeted hours',
        ],
        customFields: [],
      },
    ],
  },
  {
    name: 'Education',
    key: 'education',
    templates: [
      {
        name: 'Course Content',
        title: 'Course: Add a Course Name',
        groups: [
          {
            name: 'Chapter 1',
            tasks: ['Lesson 1', 'Lesson 2'],
          },
          {
            name: 'Chapter 2',
            tasks: ['Lesson 1', 'Lesson 2'],
          },
          {
            name: 'Chapter 3',
            tasks: ['Lesson 1', 'Lesson 2'],
          },
          {
            name: 'Chapter 4',
            tasks: ['Lesson 1', 'Lesson 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
      {
        name: 'Research Paper',
        title: 'Research: Add a Topic',
        groups: [
          {
            name: 'Abstract',
            tasks: ['Abstract 1', 'Abstract 2'],
          },
          {
            name: 'Methods',
            tasks: ['Method 1', 'Method 2'],
          },
          {
            name: 'Results',
            tasks: ['Result 1', 'Result 2'],
          },
          {
            name: 'Discussion',
            tasks: ['Discussion 1', 'Discussion 2'],
          },
          {
            name: 'References',
            tasks: ['Reference 1', 'Reference 2'],
          },
          {
            name: 'Appendix',
            tasks: ['Appendix 1', 'Appendix 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
    ],
  },
  {
    name: 'HR',
    key: 'HR',
    templates: [
      {
        name: 'New Recruit Onboarding',
        title: 'New Recruit Onboarding',
        groups: [
          {
            name: 'General',
            tasks: ['Background', 'Mission & Vision', 'Management'],
          },
          {
            name: 'Checklist',
            tasks: ['Orientation', 'Workstation', 'Stationery'],
          },
          {
            name: 'Forms',
            tasks: ['Leave Form', 'Claim Form'],
          },
          {
            name: 'Tools',
            tasks: ['GoKudos'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
      {
        name: 'Job Vacancy',
        title: 'Vacancy: Add a Position Name',
        groups: [
          {
            name: 'Responsibles',
            tasks: ['Responsible 1', 'Responsible 2'],
          },
          {
            name: 'Requirements',
            tasks: ['Requirement 1', 'Requirement 2'],
          },
          {
            name: 'Perks',
            tasks: ['Basic Salary', 'Allowances'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
    ],
  },
  {
    name: 'IT',
    key: 'IT',
    templates: [
      {
        name: 'Asset Tracking',
        title: 'Asset Tracking',
        groups: [
          {
            name: 'Laptops',
            tasks: ['Laptop 1', 'Laptop 2'],
          },
          {
            name: 'Printers',
            tasks: ['Printer 1', 'Printer 2'],
          },
          {
            name: 'Licenses',
            tasks: ['License 1', 'License 2'],
          },
          {
            name: 'Domains',
            tasks: ['Domain1.com', 'Domain2.com'],
          },
        ],
        status: ['New', 'Used', 'Damaged', 'Scrapped'],
        fields: ['Due Date', 'Assignee'],
        customFields: [],
      },
      {
        name: 'IT Request',
        title: 'IT Request',
        groups: [
          {
            name: 'Software',
            tasks: ['Software 1', 'Software 2'],
          },
          {
            name: 'Hardware',
            tasks: ['Hardware 1', 'Hardware 2'],
          },
          {
            name: 'Network',
            tasks: ['Network 1', 'Network 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
      {
        name: 'Software Development',
        title: 'Development: Add a Project Name',
        groups: [
          {
            name: 'Planning',
            tasks: ['Objective', 'Research'],
          },
          {
            name: 'Design',
            tasks: ['Prototyping', 'UI/UX'],
          },
          {
            name: 'Development',
            tasks: ['Database', 'Programming'],
          },
          {
            name: 'Testing',
            tasks: ['Testing 1', 'Testing 2'],
          },
          {
            name: 'Deployment',
            tasks: ['Server 1', 'Server 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
    ],
  },
  {
    name: 'Marketing',
    key: 'Marketing',
    templates: [
      {
        name: 'Content Calendar',
        title: 'Content Calendar: #year',
        groups: [
          {
            name: 'January',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'February',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'March',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'April',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'May',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'June',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'July',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'August',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'September',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'October',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'November',
            tasks: ['Post 1', 'Post 2'],
          },
          {
            name: 'December',
            tasks: ['Post 1', 'Post 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee'],
        customFields: [],
      },
      {
        name: 'Brand Assets',
        title: 'Brand: Add a Brand Name',
        groups: [
          {
            name: 'Logo',
            tasks: ['Master Logo', 'Logomark'],
          },
          {
            name: 'Colour',
            tasks: ['Primary Colour', 'Accent Colour'],
          },
          {
            name: 'Typography',
            tasks: ['Title Font', 'Body Font'],
          },
          {
            name: 'Templates',
            tasks: ['Business Card', 'Letterhead'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee'],
        customFields: [],
      },
      {
        name: 'Marketing Campaign',
        title: 'Campaign: Add a Campaign Name',
        groups: [
          {
            name: 'Objectives',
            tasks: ['Objectives 1', 'Objectives 2'],
          },
          {
            name: 'Audiences',
            tasks: ['Audience 1', 'Audience 2'],
          },
          {
            name: 'Content',
            tasks: ['Copywriting', 'Design'],
          },
          {
            name: 'Channels',
            tasks: ['Search Engine', 'Social Media'],
          },
          {
            name: 'Budget',
            tasks: ['Budget 1', 'Budget 2'],
          },
          {
            name: 'Results',
            tasks: ['Impression', 'Conversion'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee'],
        customFields: [],
      },
    ],
  },
  {
    name: 'Sales',
    key: 'Sales',
    templates: [
      {
        name: 'Sales Pipeline',
        title: 'Sales Pipeline',
        groups: [
          {
            name: 'New Opportunities',
            tasks: ['Prospect 1', 'Prospect 2'],
          },
          {
            name: 'Active Opportunities',
            tasks: ['Prospect 1', 'Prospect 2'],
          },
          {
            name: 'Last Stage Opportunities',
            tasks: ['Prospect 1', 'Prospect 2'],
          },
          {
            name: 'Closed Won',
            tasks: ['Prospect 1', 'Prospect 2'],
          },
          {
            name: 'Closed Lost',
            tasks: ['Prospect 1', 'Prospect 2'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee', 'Priority'],
        customFields: [],
      },
      {
        name: 'Sales Deck',
        title: 'Sales Deck',
        groups: [
          {
            name: 'Executive Summary',
            tasks: ['Problems', 'Solutions'],
          },
          {
            name: 'About Us',
            tasks: ['Background', 'Mission & Vision', 'Management'],
          },
          {
            name: 'Product/Services',
            tasks: ['Feature 1', 'Feature 2'],
          },
          {
            name: 'Pricing',
            tasks: ['Plans', 'Bundles'],
          },
          {
            name: 'Call to Action',
            tasks: ['Why Us', 'Free Consultation'],
          },
        ],
        status: ['Todo', 'Doing', 'Done', 'KIV'],
        fields: ['Due Date', 'Assignee'],
        customFields: [],
      },
    ],
  },
] as {
  name: string;
  key: string;
  templates: {
    name: string;
    title: string;
    groups: {
      name: string;
      tasks: string[];
    }[];
    status: string[];
    fields: string[];
    customFields?: { name: string; type: ProjectGroupCustomAttributeType }[];
  }[];
}[];

export {
  taskRecurringDayOptions,
  TASK_ATTACHMENT_ACCEPT_TYPE,
  WORKSPACE_COLORS,
  TASK_PRIORITY_COLORS,
  TASK_RECURRING_CASCADER_OPTIONS,
  TASK_NAME_MAX_LENGTH,
  TASK_PROPERTY_OPTIONS,
  DEFAULT_PROJECT_TEMPLATES_GALLERY,
};
