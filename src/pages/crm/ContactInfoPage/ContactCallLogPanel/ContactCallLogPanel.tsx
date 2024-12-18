import {
  Space,
  Input,
  Button,
  Card,
  Grid,
  Avatar,
  Comment,
  Typography,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { MdAdd, MdMoreVert, MdOutlineComment, MdSearch } from 'react-icons/md';

import styles from './ContactCallLogPanel.module.less';
import { EditContactCallLogModal, FormValues } from './EditContactCallLogModal';

import { useDisclosure } from '@/hooks';

const { Row, Col } = Grid;

const ContactCallLogPanel = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [editCallLog, setEditCallLog] = useState<unknown>();

  const { visible, onClose, onOpen } = useDisclosure();

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleCloseModal = () => {
    onClose();

    setEditCallLog(undefined);
  };

  const handleCreateCallLog = (values: FormValues) => {};

  const handleUpdateCallLog = (values: FormValues) => {};

  return (
    <div>
      <Input
        style={{ width: '22%' }}
        placeholder="Search call record"
        suffix={<MdSearch />}
        value={searchKeyword}
        onChange={handleUpdateSearchKeyword}
      />

      <Space className={styles.wrapper} direction="vertical">
        <Button
          className={styles['add-button']}
          icon={<MdAdd />}
          onClick={onOpen}
        >
          Add New
        </Button>

        <LogGroup />
      </Space>

      <EditContactCallLogModal
        visible={visible}
        onCancel={handleCloseModal}
        loading={false}
        callLog={editCallLog}
        onCreate={handleCreateCallLog}
        onUpdate={handleUpdateCallLog}
      />
    </div>
  );
};

const LogGroup = () => {
  return (
    <div className={styles['log-group']}>
      <Typography.Title heading={5}>May 2022</Typography.Title>

      <Space direction="vertical" size={20}>
        <LogCard />
        <LogCard />
      </Space>
    </div>
  );
};

const LogCard = () => {
  const [showComments, setShowComments] = useState<boolean>(false);

  const handleToggleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <Card className={styles['log-card']}>
      <div className={styles['user-wrapper']}>
        <Space size={15}>
          <Avatar size={30} />

          <div>
            <div className={styles['user-name']}>Chingku Liew</div>
            <div className={styles['created-at']}>
              {dayjs().format('DD MMM YY [at] hh:mmA')}
            </div>
          </div>
        </Space>

        <Button icon={<MdMoreVert />} type="text" />
      </div>

      <div className={styles.content}>
        <Space className={styles['log-info']} direction="vertical" size={5}>
          <Row>
            <Col xs={24} md={12} xl={5}>
              <Space>
                <Typography.Text>Contacted PIC :</Typography.Text>
                <Typography.Text>Helene Jackson</Typography.Text>
              </Space>
            </Col>

            <Col xs={24} md={12} xl={{ span: 4, offset: 1 }}>
              <Space>
                <Typography.Text>Call outcome :</Typography.Text>
                <Typography.Text>No answer</Typography.Text>
              </Space>
            </Col>

            <Col xs={24} md={12} xl={{ span: 3, offset: 1 }}>
              <Space>
                <Typography.Text>Call type :</Typography.Text>
                <Typography.Text>Call</Typography.Text>
              </Space>
            </Col>

            <Col xs={24} md={12} xl={{ span: 4, offset: 1 }}>
              <Space>
                <Typography.Text>Reminder :</Typography.Text>
                <Typography.Text>1 week before</Typography.Text>
              </Space>
            </Col>
          </Row>

          <Typography.Text>
            Helene Jackson didn’t answer my call. I will try to call him later
            today.
          </Typography.Text>
        </Space>

        <div onClick={handleToggleShowComments}>
          <Space className={styles['comment-button']} align="center">
            <MdOutlineComment /> 3 Comment
          </Space>
        </div>

        {showComments && (
          <div className={styles['comment-list']}>
            <Comment
              align="right"
              author="Bob"
              avatar={<Avatar size={32}>B</Avatar>}
              datetime="1 hour"
              content={
                <div>
                  Iste sed hic ut. Totam assumenda sed non cumque similique. Eos
                  id vel vero aut. Ad nam mollitia repudiandae illum. Non
                  deleniti nobis sed dignissimos blanditiis. Ut beatae iure
                  voluptas ducimus qui minus deleniti.
                </div>
              }
            >
              <Comment
                className={styles['post-comment']}
                align="right"
                actions={[<Button key="0">Post Comment</Button>]}
                avatar={<Avatar size={32}>B</Avatar>}
                author="Bob"
                content={<Input placeholder="Add a comment... @ to mention" />}
              />
            </Comment>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContactCallLogPanel;
