import {
  Modal,
  Grid,
  Space,
  Button,
  Input,
  Typography,
  Table,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import type { AccountInfo } from '@azure/msal-browser';
import { useIsAuthenticated } from '@azure/msal-react';
import dayjs from 'dayjs';
import type { Drive, DriveItem } from 'microsoft-graph';
import { useEffect, useState } from 'react';
import { MdFilePresent, MdFolderOpen, MdSearch } from 'react-icons/md';

import MyModal from '@/components/Modal';

import styles from './OneDriveModal.module.less';

import useMsalAuth from '@/hooks/useMsalAuth';

import { MicrosoftGraphService } from '@/services';

import { isSafariAndIOS } from '@/utils/browser.utils';

import { CALENDAR_FORMAT } from '@/constants/date.constants';

import { BaseModalConfig } from '@/types';

const { Row, Col } = Grid;

type Props = BaseModalConfig & {
  onFileSelected: (payload: {
    name: string;
    mimeType: string;
    url: string;
  }) => void;
};

const OneDriveModal = (props: Props) => {
  const { visible, onCancel, onFileSelected } = props;

  const isAuthenticated = useIsAuthenticated();

  const [searchKeyword, setSearchKeyword] = useState<string>();
  const [userDrive, setUserDrive] = useState<Drive>();
  const [driveItems, setDriveItems] = useState<DriveItem[]>([]);
  const [folderHistory, setFolderHistory] = useState<DriveItem[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string>();

  const { getActiveAccount, login, logout, authProvider, loginRedirect } =
    useMsalAuth();

  useEffect(() => {
    if (visible && isAuthenticated && !accountInfo) {
      const activeAccount = getActiveAccount();
      setAccountInfo(activeAccount);

      loadUserDrive();
    }
  }, [visible]);

  useEffect(() => {
    if (userDrive) {
      loadDriveItems();
    }
  }, [userDrive]);

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleLogin = async () => {
    const { isSafari } = isSafariAndIOS();

    if (isSafari) {
      MyModal.confirm({
        title: 'One Drive',
        content: (
          <div style={{ textAlign: 'center' }}>
            Redirect you to login one drive
          </div>
        ),
        onOk: loginRedirect,
      });
    } else {
      await login();

      const activeAccount = getActiveAccount();
      setAccountInfo(activeAccount);

      loadUserDrive();
    }
  };

  const handleLogout = async () => {
    logout();

    setAccountInfo(undefined);
  };

  const handleRefresh = async () => {
    if (!userDrive) {
      loadUserDrive();
    } else {
      loadDriveItems();
    }
  };

  const loadUserDrive = async () => {
    const drive = await MicrosoftGraphService.getUserDrive(authProvider);
    setFolderHistory([]);
    setUserDrive(drive);
  };

  const loadDriveItems = async () => {
    if (userDrive?.id) {
      setLoading(true);

      const items = await MicrosoftGraphService.listDriveItemChildren(
        authProvider,
        {
          driveId: userDrive.id || '',
          itemId: 'root',
        },
      );

      setFolderHistory([]);
      setDriveItems(items);
      setLoading(false);
    }
  };

  const handleSelect = async (item: DriveItem) => {
    if (userDrive?.id && item?.id) {
      setSelectedItemId(item.id);

      const link = await MicrosoftGraphService.createSharingLink(authProvider, {
        itemId: item.id,
        driveId: userDrive.id,
      });

      setSelectedItemId(undefined);

      onFileSelected({
        name: item.name as string,
        mimeType: item.file?.mimeType as string,
        url: link,
      });

      onCancel();
    } else {
      console.error('no drive or item');
    }
  };

  const handleBrowseFolder = async (item: DriveItem) => {
    if (loading) {
      return;
    }

    if (userDrive?.id && item?.id) {
      const itemIndex = folderHistory.findIndex(
        (folder) => folder.id === item.id,
      );

      const newHistory =
        itemIndex >= 0
          ? folderHistory.slice(0, itemIndex + 1)
          : [...folderHistory, item];

      setFolderHistory(newHistory);

      setLoading(true);

      const items = await MicrosoftGraphService.listDriveItemChildren(
        authProvider,
        {
          driveId: userDrive.id,
          itemId: item.id,
        },
      );

      setDriveItems(items);
      setLoading(false);
    } else {
      console.error('no drive or item');
    }
  };

  const handleGoToRoot = async () => {
    setFolderHistory([]);
    loadDriveItems();
  };

  const renderBreadcrumbs = () => {
    return folderHistory.map((item, index) => {
      const isLastItem = index === folderHistory.length - 1;

      return isLastItem ? (
        <Typography.Text key={item.id} className={styles['breadcrumb-txt']}>
          {item.name}
        </Typography.Text>
      ) : (
        <Button
          key={index}
          className={styles['breadcrumb-btn']}
          type="text"
          onClick={() => handleBrowseFolder(item)}
        >
          {item.name}
        </Button>
      );
    });
  };

  const columns: ColumnProps<DriveItem>[] = [
    {
      key: 'icon',
      title: '',
      width: 50,
      render: (col, item) => {
        return item.folder ? (
          <MdFolderOpen className={styles.icon} />
        ) : (
          <MdFilePresent className={styles.icon} />
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Last updated',
      render: (col, item) => {
        return dayjs(item.createdDateTime).calendar(null, CALENDAR_FORMAT);
      },
    },
    {
      key: 'action',
      title: '',
      width: 50,
      render: (col, item) => {
        const isSelected = selectedItemId === item.id;

        return (
          !item.folder && (
            <Button
              className={styles['theme-button']}
              loading={isSelected}
              disabled={!isSelected && !!selectedItemId}
              onClick={() => handleSelect(item)}
            >
              Insert
            </Button>
          )
        );
      },
    },
  ];

  return (
    <Modal
      className={styles.wrapper}
      visible={visible}
      onCancel={onCancel}
      title="One Drive"
      footer={null}
    >
      <Row>
        <Col className={styles['left-panel']} span={6}>
          {!isAuthenticated && <Button onClick={handleLogin}>Login</Button>}

          {isAuthenticated && (
            <Space direction="vertical" size={20}>
              <Input
                placeholder="Search"
                suffix={<MdSearch />}
                value={searchKeyword}
                onChange={handleUpdateSearchKeyword}
              />

              <div>
                <Typography.Paragraph className={styles.username}>
                  {accountInfo?.name}
                </Typography.Paragraph>

                <Typography.Paragraph className={styles.email}>
                  {accountInfo?.username}
                </Typography.Paragraph>
              </div>
            </Space>
          )}

          <div>
            {isAuthenticated && <Button onClick={handleLogout}>Log out</Button>}
          </div>
        </Col>

        {isAuthenticated && (
          <Col className={styles['right-panel']} span={18}>
            <Grid.Row justify="space-between" align="center">
              <Space split={'>'}>
                {folderHistory.length > 0 ? (
                  <Button type="text" onClick={handleGoToRoot}>
                    My files
                  </Button>
                ) : (
                  <Typography.Text className={styles['breadcrumb-txt']}>
                    My files
                  </Typography.Text>
                )}

                {renderBreadcrumbs()}
              </Space>

              <Button onClick={handleRefresh}>Refresh</Button>
            </Grid.Row>

            <Table
              loading={loading}
              border={false}
              pagination={false}
              scroll={{}}
              data={driveItems}
              columns={columns}
              onRow={(record) => ({
                onDoubleClick: () =>
                  record.folder && handleBrowseFolder(record),
              })}
            />
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default OneDriveModal;
