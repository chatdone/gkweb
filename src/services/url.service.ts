const openTermsAndConditions = () => {
  window.open(
    'https://assets.gokudos.io/Platform+T%26C+3.0+-+1+Nov+2021.pdf',
    '_blank',
  );
};

const openPrivacyPolicy = () => {
  window.open('https://gokudos.io/privacy-policy/', '_blank');
};

export default { openTermsAndConditions, openPrivacyPolicy };
