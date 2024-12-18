import { Breadcrumb, Grid, Menu } from '@arco-design/web-react';
import { IconHome } from '@arco-design/web-react/icon';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './ContentHeader.module.less';

import { useAppStore } from '@/stores/useAppStore';

const { Row, Col } = Grid;

export type Props = {
  showBreadCrumb?: boolean;
  rightElement?: ReactNode;
  breadcrumbItems?: BreadCrumbItem[];
  onBreadcrumbMenuItemSelected?: (key: string) => void;
};

export type BreadCrumbItem = {
  name: string;
  path?: string;
  children?: {
    name: string;
    key: string;
  }[];
};

const ContentHeader = (props: Props) => {
  const {
    showBreadCrumb = true,
    rightElement,
    onBreadcrumbMenuItemSelected,
    breadcrumbItems,
  } = props;

  const { activeCompany } = useAppStore();

  const handleClickAddMenuItem = (key: string) => {
    onBreadcrumbMenuItemSelected?.(key.replace('menuitem:', ''));
  };

  return (
    <Row className={styles.container} justify="space-between" align="center">
      <Col xs={24} md={12}>
        {showBreadCrumb && (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={`/${activeCompany?.slug}`} data-testid="home">
                <IconHome />
              </Link>
            </Breadcrumb.Item>

            {breadcrumbItems?.map((item, index) => {
              if (item.children) {
                return (
                  <Breadcrumb.Item
                    key={`breadcrumb:${index}`}
                    droplist={
                      <Menu
                        onClickMenuItem={handleClickAddMenuItem}
                        data-testid={`bcmenuitem`}
                      >
                        {item.children.map((e) => {
                          return (
                            <Menu.Item
                              key={`menuitem:${e.key}`}
                              data-testid={`bcmenuitem:${e.key}`}
                            >
                              {e.name}
                            </Menu.Item>
                          );
                        })}
                      </Menu>
                    }
                  >
                    {item.name}
                  </Breadcrumb.Item>
                );
              } else {
                return (
                  <Breadcrumb.Item key={`breadcrumb:${index}`}>
                    {item.path ? (
                      <Link
                        to={`/${activeCompany?.slug}${item.path}`}
                        data-testid="link"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </Breadcrumb.Item>
                );
              }
            })}
          </Breadcrumb>
        )}
      </Col>

      <Col className={styles['right-element']} xs={24} md={12}>
        {rightElement}
      </Col>
    </Row>
  );
};

export default ContentHeader;
