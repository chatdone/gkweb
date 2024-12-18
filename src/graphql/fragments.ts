import { gql } from '@apollo/client';

const companyInfoFragment = gql`
  fragment CompanyInfoFragment on Company {
    id
    name
    logoUrl
    settings
    defaultTimezone
    slug
    members {
      id
      type
      active
      teams {
        id
        title
        members {
          id
          user {
            id
            name
            email
          }
        }
      }
      user {
        id
        name
        email
        profileImage
      }
    }
    currentSubscription {
      id
      invoiceQuota
      reportQuota
      storageQuota
      taskQuota
      teamQuota
      userQuota
      stripeSubscriptionId
      package {
        id
        name
        isCustom
        invoiceQuota
        reportQuota
        storageQuota
        taskQuota
        teamQuota
        userQuota
      }
    }
  }
`;

const userProfileFragment = gql`
  fragment UserProfileFragment on User {
    id
    name
    email
    onboarding
    profileImage
    createdAt
    signUpData
    companies {
      ...CompanyInfoFragment
    }
    defaultCompany {
      ...CompanyInfoFragment
    }
    stripeCustomerDetails {
      id
      default_currency
    }
  }
  ${companyInfoFragment}
`;

const taskFragment = gql`
  fragment TaskFragment on Task {
    id
    name
    description
    dueDate
    startDate
    endDate
    dueReminder
    stageStatus
    createdAt
    priority
    timeSpent
    projectedCost
    archived
    visibility
    published
    taskActivities {
      id
      fieldName
      actionType
      fromValueTo
      toValue
      fromDate
      toDate
      fromLabel
      toLabel
      createdAt
      targetPic {
        id
      }
      targetMember {
        id
      }
      attachment {
        id
      }
      fromCardStatus {
        id
      }
      toCardStatus {
        id
      }
    }
    tags {
      id
      name
      color
    }
    templateTask {
      isRecurring
    }
    companyTeamStatus {
      id
      label
    }
    subtasks {
      id
      title
      checked
      sequence
    }
    createdBy {
      id
      name
      email
    }
    comments {
      id
      message
      messageContent
      createdAt
      createdBy {
        id
        name
        email
        profileImage
      }
      parentTaskComment {
        id
        messageContent
        message
        createdAt
        createdBy {
          id
          name
          email
          profileImage
        }
      }
      attachments {
        id
        name
        isDeleted
        createdBy {
          id
          email
          name
          profileImage
        }
      }
    }
    members {
      id
      companyMember {
        id
        user {
          id
          name
          email
          profileImage
        }
      }
    }
    pics {
      id
      pic {
        id
        name
        user {
          id
          name
          email
          profileImage
        }
      }
    }
    attachments {
      id
      name
      createdAt
      url
      isExternal
      externalSource
      createdBy {
        id
        email
        name
        profileImage
      }
    }
    taskActivities {
      id
      createdAt
      fieldName
      actionType
      fromValueTo
      toValue
      fromDate
      toDate
      fromLabel
      toLabel
      targetPic {
        id
        name
        user {
          id
          name
          email
        }
      }
      targetMember {
        id
        user {
          id
          name
          email
        }
      }
      fromCardStatus {
        id
        label
      }
      toCardStatus {
        id
        label
      }
      attachment {
        id
        name
      }
      createdBy {
        id
        name
        email
        profileImage
      }
    }
    companyTeam {
      id
      members {
        id
        user {
          id
          email
          name
        }
      }
      statuses {
        id
        label
        sequence
        parentStatus
      }
    }
    taskBoard {
      id
      type
      category
      name
      company {
        id
      }
      contact {
        id
        name
        pics {
          id
          name
        }
      }
      taskBoardTeams {
        id
        companyTeam {
          id
          members {
            id
            user {
              id
              email
              name
            }
          }
        }
      }
    }
    templateTask {
      id
      isRecurring
      recurringSetting {
        intervalType
        day
        month
        skipWeekend
      }
    }
  }
`;

const boardFragment = gql`
  fragment BoardFragment on TaskBoard {
    id
    name
    description
    type
    archived
    category
    pinned
    visibility
    createdBy {
      id
      name
      email
    }
    visibilityWhitelist {
      teams {
        id
        title
      }
      members {
        id
        user {
          id
          name
          email
        }
      }
    }
    owners {
      companyMember {
        id
        user {
          name
          email
        }
      }
    }
    contact {
      id
    }
    folder {
      id
      name
    }
    members {
      id
    }
    tasks {
      id
      dueDate
      name
      description
      pinned
      stageStatus
      archived
      subtasks {
        id
        title
        checked
      }
      members {
        id
        user {
          id
          name
          email
          profileImage
        }
      }
      companyTeamStatus {
        id
        label
        color
        stage
      }
    }
    taskBoardTeams {
      id
      companyTeam {
        id
        title
        statuses {
          id
          label
          color
          stage
        }
        members {
          user {
            id
            name
            email
          }
        }
      }
    }
    timeSpent
    color
    contact {
      id
      name
    }
  }
`;

const companyMemberFragment = gql`
  fragment CompanyMemberFragment on CompanyMember {
    id
    user {
      id
      email
      name
      active
    }
    type
    position
    createdAt
    hourlyRate
    referenceImage {
      imageUrl
      s3Bucket
      s3Key
      status
      remark
      actionBy {
        id
        name
        email
      }
    }
    employeeType {
      id
    }
  }
`;

const attendanceDayFragment = gql`
  fragment AttendanceDayFragment on AttendanceDaySummary {
    tracked
    regular
    overtime
    worked
    firstAttendance {
      startDate
      location {
        name
      }
    }
    lastAttendance {
      startDate
      endDate
      label {
        name
        color
      }
    }
    attendances {
      comments
      commentsOut
      startDate
      endDate
      type
      timeTotal
      label {
        name
        color
      }
      location {
        name
      }
    }
    companyMember {
      id
      employeeType {
        id
        name
        workDaySettings {
          timezone
        }
      }
      user {
        id
        email
        name
        profileImage
      }
    }
  }
`;

const promoCodeInfoFragment = gql`
  fragment PromoCodeInfoFragment on DiscountedPrice {
    id
    discounted_price
    price
    price_per_unit
    name
    interval
    package {
      id
    }
  }
`;

const taskTemplateFragment = gql`
  fragment TaskTemplateFragment on TaskTemplate {
    id
    name
    description
    copySubtasks
    copyAttachments
    createdAt
    type
    isRecurring
    recurringSetting {
      intervalType
      day
      month
    }
    createdBy {
      id
      name
      email
      profileImage
    }
    items {
      name
      sequence
      isSubtask
    }
    attachments {
      name
    }
  }
`;

const tagGroupFragment = gql`
  fragment TagGroupFragment on TagGroup {
    id
    name
    tags {
      id
      name
    }
  }
`;

export {
  companyInfoFragment,
  userProfileFragment,
  taskFragment,
  boardFragment,
  attendanceDayFragment,
  companyMemberFragment,
  promoCodeInfoFragment,
  taskTemplateFragment,
  tagGroupFragment,
};
