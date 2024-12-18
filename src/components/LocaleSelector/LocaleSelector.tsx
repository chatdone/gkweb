import { Select } from '@arco-design/web-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  triggerElement: ReactNode;
};

const LocaleSelector = (props: Props) => {
  const { triggerElement } = props;

  const { i18n } = useTranslation();

  const handleChangeLocale = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      triggerElement={triggerElement}
      options={[
        { label: 'English', value: 'en' },
        { label: '中文', value: 'zh' },
      ]}
      value={i18n.language}
      triggerProps={{
        autoAlignPopupWidth: false,
        autoAlignPopupMinWidth: true,
        position: 'br',
      }}
      trigger="hover"
      onChange={handleChangeLocale}
    />
  );
};

export default LocaleSelector;
