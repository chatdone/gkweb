import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { escapeRegExp } from 'lodash-es';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ArcoConfig.module.less';

const ArcoConfig = ({ children }: { children: ReactNode }) => {
  const { i18n, t } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'zh':
        return zhCN;

      default:
        return {
          ...enUS,
          Form: {
            validateMessages: {
              required: t('form.required'),
            },
          },
        };
    }
  };

  return (
    <ConfigProvider
      locale={getLocale()}
      componentConfig={{
        Modal: {
          okButtonProps: {
            style: {
              background: '#d6001c',
            },
          },
        },
        'Timeline.Item': {
          dotColor: '#D6001C',
        },
        Table: {
          rowKey: 'id',
          scroll: { x: 1000 },
          pagination: {
            activePageItemStyle: {
              background: '#FFDDE0',
              color: '#E64E59',
              fontWeight: '900',
            },
          },
        },
        Pagination: {
          activePageItemStyle: {
            background: '#FFDDE0',
            color: '#E64E59',
            fontWeight: '900',
          },
        },
        Checkbox: {
          className: styles.checkbox,
        },
        Skeleton: {
          animation: true,
        },
        TreeSelect: {
          fieldNames: {
            key: 'id',
          },
        },
        Drawer: {
          className: styles.drawer,
          okButtonProps: {
            style: {
              background: '#d6001c',
            },
          },
        },
        Radio: {
          className: styles.radio,
        },
        Switch: {
          className: styles.switch,
        },
        Select: {
          filterOption: (inputValue, option) => {
            const regex = new RegExp(escapeRegExp(inputValue), 'i');

            return option.props.children.match(regex);
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ArcoConfig;
