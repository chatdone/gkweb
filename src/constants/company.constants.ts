import { CompanyMemberType } from 'generated/graphql-types';

const companyMemberTypeOptions = [
  {
    label: 'Admin',
    value: CompanyMemberType.Admin,
  },
  {
    label: 'Manager',
    value: CompanyMemberType.Manager,
  },
  {
    label: 'Member',
    value: CompanyMemberType.Member,
  },
];

export { companyMemberTypeOptions };
