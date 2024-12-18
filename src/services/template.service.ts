import { isSafariAndIOS } from '@/utils/browser.utils';

const downloadCompanyMemberTemplate = () => {
  const { isSafari } = isSafariAndIOS();

  if (isSafari) {
    window.open(
      'https://drive.google.com/file/d/1doifKnFp_qKBuih6GCrZMMtw469Oxqbp/view?usp=sharing',
      '_blank',
    );
  } else {
    window.open(
      'https://gokudos-dev-public.s3.ap-southeast-1.amazonaws.com/template/company-users-invitation-template.xlsx+-+Users.csv',
    );
  }
};

const downloadContactTemplate = () => {
  const { isSafari } = isSafariAndIOS();

  if (isSafari) {
    window.open(
      'https://drive.google.com/file/d/1wHjvOHe-IP-wDmFHRG5tKQDjkqg1rTIf/view?usp=sharing',
      '_blank',
    );
  } else {
    window.open(
      'https://gokudos-dev-public.s3.ap-southeast-1.amazonaws.com/template/company-contact-pic-template.csv',
    );
  }
};

const downloadTaskTemplate = () => {
  const { isSafari } = isSafariAndIOS();

  if (isSafari) {
    window.open(
      'https://drive.google.com/file/d/1gBvr0BSGnUdsjGNombsMjP2cHM5541uj/view?usp=sharing',
      '_blank',
    );
  } else {
    window.open(
      'https://gokudos-dev-public.s3.ap-southeast-1.amazonaws.com/template/task-import-template.csv',
    );
  }
};

export default {
  downloadCompanyMemberTemplate,
  downloadContactTemplate,
  downloadTaskTemplate,
};
