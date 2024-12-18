import { faker } from '@faker-js/faker';

const companyDataModel = () => ({
  id: faker.datatype.number(),
  name: faker.music.genre(),
  description: faker.lorem.sentence(),
  // slug: faker.lorem.sentence(),
});

const taskDataModel = () => ({
  jobId: faker.datatype.uuid(),
  name: faker.random.word(),
  description: faker.lorem.sentence(),
  value: faker.datatype.number(),
  status: faker.datatype.number({ max: 4, min: 1 }),
  id: faker.datatype.uuid(),
  startDate: faker.date.recent(),
  endDate: faker.date.soon(),
  dueDate: faker.date.between(faker.date.past(), faker.date.future()),
  actualStart: faker.date.recent(),
  actualEnd: faker.date.soon(),
  members: [fixtures.member(), fixtures.member(), fixtures.member()],
  comments: [fixtures.comment(), fixtures.comment()],
  tags: [fixtures.tag(), fixtures.tag(), fixtures.tag()],
  attachments: [fixtures.attachment()],
  taskBoard: fixtures.board(),
});

const boardDataModel = () => ({
  id: faker.datatype.uuid(),
  name: faker.animal.cat(),
  description: faker.lorem.sentence(),
  type: ['Internal', 'Personal', 'Collaboration'][
    faker.datatype.number({ max: 2, min: 0 })
  ],
  tasks: [],
  taskBoardTeams: [fixtures.boardTeam()],
  members: [
    fixtures.member(),
    fixtures.member(),
    fixtures.member(),
    fixtures.member(),
  ],
});

const boardTeamDataModel = () => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.word(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
});

const companyMemberDataModel = () => ({
  id: faker.datatype.uuid(),
  companyId: faker.datatype.number(),
  userId: faker.datatype.number(),
  reportTo: faker.datatype.number(),
  type: faker.datatype.number({ min: 1, max: 3 }),
  position: faker.lorem.word(),
  invitationCode: faker.lorem.word(),
  employeeType: faker.datatype.number(),
  user: fixtures.user(),
});

const taskCommentDataModel = () => ({
  id: faker.datatype.uuid(),
});

const taskAttachmentDataModel = () => ({
  id: faker.datatype.uuid(),
});

const tagsDataModel = () => ({
  id: faker.datatype.uuid(),
  color: faker.internet.color(),
  name: faker.animal.type(),
});

const tagGroupDataModal = () => ({
  id: faker.datatype.uuid(),
  name: faker.random.word(),
  tags: [fixtures.tag()],
});

const userDataModel = () => ({
  id: faker.datatype.uuid(),
  name: faker.internet.userName(),
  email: faker.internet.email(),
  profileImage: faker.internet.avatar(),
});

const companyTeamDataModel = () => ({
  id: faker.datatype.uuid(),
  title: faker.random.word(),
  members: [fixtures.member(), fixtures.member()],
  statuses: [fixtures.companyTeamStatus(), fixtures.companyTeamStatus()],
});

const companyTeamStatusDataModel = () => ({
  id: faker.datatype.uuid(),
  label: faker.random.words(),
});

const selectOptionDataModel = () => ({
  label: faker.random.words(),
  value: faker.datatype.uuid(),
});

const fixtures = {
  company: companyDataModel,
  task: taskDataModel,
  member: companyMemberDataModel,
  comment: taskCommentDataModel,
  attachment: taskAttachmentDataModel,
  tag: tagsDataModel,
  tagGroup: tagGroupDataModal,
  board: boardDataModel,
  boardTeam: boardTeamDataModel,
  user: userDataModel,
  companyTeam: companyTeamDataModel,
  companyTeamStatus: companyTeamStatusDataModel,
  selectOption: selectOptionDataModel,
};

const generate = (type: string, count = 1) => {
  if (count === 1) {
    // @ts-ignore
    return fixtures[type]();
  } else {
    const items = [];
    for (let i = 0; i < count; i++) {
      // @ts-ignore
      items.push(fixtures[type]());
    }
    return items;
  }
};

export default {
  generate,
};
