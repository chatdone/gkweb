import { Tabs as ArcoTabs, TabsProps } from '@arco-design/web-react';
import type { ReactNode } from 'react';

const TabPane = ArcoTabs.TabPane;

type Tab = {
  key: string;
  title: ReactNode;
  content?: ReactNode;
};

type Props = {
  tabs: Tab[];
  tabsProps?: TabsProps;
};

const Tabs = (props: Props) => {
  const { tabs, tabsProps } = props;

  return (
    <ArcoTabs {...tabsProps}>
      {tabs.map((tab) => (
        <TabPane key={tab.key} title={tab.title}>
          {tab.content}
        </TabPane>
      ))}
    </ArcoTabs>
  );
};

export default Tabs;
