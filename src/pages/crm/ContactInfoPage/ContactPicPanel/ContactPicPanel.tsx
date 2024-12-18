import { gql, useMutation } from '@apollo/client';
import { Space, Card, Grid, Input } from '@arco-design/web-react';
import { escapeRegExp } from 'lodash-es';
import { ReactNode, useState } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';

import Message from '@/components/Message';
import Modal from '@/components/Modal';

import ContactPicCard from './ContactPicCard';
import styles from './ContactPicPanel.module.less';
import { EditContactPicModal, FormValues } from './EditContactPicModal';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import type { ArrayElement } from '@/types';

import type {
  ContactInfoPageQuery,
  CreateContactPicMutation,
  CreateContactPicMutationVariables,
  UpdateContactPicMutation,
  UpdateContactPicMutationVariables,
  DeleteContactPicMutation,
  DeleteContactPicMutationVariables,
} from 'generated/graphql-types';

const Row = Grid.Row;
const Col = Grid.Col;

export const contactPicPanelFragment = gql`
  fragment ContactPicPanelFragment on ContactPic {
    id
    name
    remarks
    contactNo
    user {
      id
      email
    }
  }
`;

type QueryContactPic = ArrayElement<
  NonNullable<ContactInfoPageQuery['contact']>['pics']
>;

type Props = {
  contactId: string;
  pics: NonNullable<ContactInfoPageQuery['contact']>['pics'];
  refetchQuery: () => void;
};

const ContactPicPanel = (props: Props) => {
  const { contactId, pics, refetchQuery } = props;

  const { activeCompany } = useAppStore();

  const [mutateCreateContactPic, { loading: mutateCreateContactPicLoading }] =
    useMutation<CreateContactPicMutation, CreateContactPicMutationVariables>(
      createContactPicMutation,
    );
  const [mutateUpdateContactPic, { loading: mutateUpdateContactPicLoading }] =
    useMutation<UpdateContactPicMutation, UpdateContactPicMutationVariables>(
      updateContactPicMutation,
    );
  const [mutateDeleteContactPic] = useMutation<
    DeleteContactPicMutation,
    DeleteContactPicMutationVariables
  >(deleteContactPicMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [editPic, setEditPic] = useState<QueryContactPic>();

  const { visible, onClose, onOpen } = useDisclosure();

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleEditPic = (pic: QueryContactPic) => {
    setEditPic(pic);

    onOpen();
  };

  const handleCloseModal = () => {
    onClose();

    setEditPic(undefined);
  };

  const handleOpenDeletePicConfirmation = () => {
    onClose();

    Modal.confirm({
      title: 'Delete External Party',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this external party?
        </div>
      ),
      onOk: handleDeleteContactPic,
    });
  };

  const handleCreatePic = async (values: FormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateCreateContactPic({
        variables: {
          companyId: activeCompany.id,
          contactId,
          input: {
            name: values.name.trim(),
            email: values.email,
            remarks: values.remarks,
            // contactNo: pic.contactNo,
            contact_no: values.contactNo,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create contact pic',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePic = async (values: FormValues) => {
    if (!activeCompany?.id || !editPic?.id) {
      return;
    }

    try {
      // TODO: camel case
      const res = await mutateUpdateContactPic({
        variables: {
          companyId: activeCompany.id,
          picId: editPic.id,
          input: {
            name: values.name.trim(),
            email: values.email,
            remarks: values.remarks,
            contact_no: values.contactNo,
            // contactNo: values.contactNo,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update contact pic',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContactPic = async () => {
    if (!activeCompany?.id || !editPic?.id) {
      return;
    }

    try {
      const res = await mutateDeleteContactPic({
        variables: {
          companyId: activeCompany.id,
          picId: editPic.id,
        },
      });

      if (!res.errors) {
        refetchQuery();

        setEditPic(undefined);
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to remove external party',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPics = () => {
    let data = [...(pics || [])];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter((pic) => pic?.name?.match(regex));
    }

    return data;
  };

  return (
    <>
      <Space className={styles['space-wrapper']} direction="vertical" size={25}>
        <Input
          className={styles['search-input']}
          placeholder="Search Person"
          suffix={<MdSearch />}
          size="large"
          allowClear
          value={searchKeyword}
          onChange={handleUpdateSearchKeyword}
        />

        <Row
          className={styles['contact-pic-grid']}
          gutter={{ sm: 12, md: 16, xl: 25 }}
          align="stretch"
        >
          <ResponsiveCol>
            <AddPicCard onClick={onOpen} />
          </ResponsiveCol>

          {getPics().map((pic) => (
            <ResponsiveCol key={pic?.id}>
              <ContactPicCard pic={pic} onEdit={() => handleEditPic(pic)} />
            </ResponsiveCol>
          ))}
        </Row>
      </Space>

      <EditContactPicModal
        visible={visible}
        onCancel={handleCloseModal}
        loading={mutateCreateContactPicLoading || mutateUpdateContactPicLoading}
        contactPic={editPic}
        onCreate={handleCreatePic}
        onUpdate={handleUpdatePic}
        onDelete={handleOpenDeletePicConfirmation}
      />
    </>
  );
};

const ResponsiveCol = ({ children }: { children: ReactNode }) => {
  return (
    <Col xs={24} sm={12} md={8} xl={6}>
      {children}
    </Col>
  );
};

const AddPicCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <Card
      className={styles['add-pic-card']}
      bordered
      title={null}
      onClick={onClick}
    >
      <div className={styles['add-icon']}>
        <MdAdd />
      </div>

      <div className={styles.description}>Add Contact Person</div>
    </Card>
  );
};

const createContactPicMutation = gql`
  mutation CreateContactPic(
    $companyId: ID!
    $contactId: ID!
    $input: CreateContactPicInput!
  ) {
    createContactPic(
      companyId: $companyId
      contactId: $contactId
      input: $input
    ) {
      id
    }
  }
`;

const updateContactPicMutation = gql`
  mutation UpdateContactPic(
    $companyId: ID!
    $picId: ID!
    $input: UpdateContactPicInput!
  ) {
    updateContactPic(companyId: $companyId, picId: $picId, input: $input) {
      id
    }
  }
`;

const deleteContactPicMutation = gql`
  mutation DeleteContactPic($companyId: ID!, $picId: ID!) {
    deleteContactPic(companyId: $companyId, picId: $picId) {
      contact {
        id
      }
    }
  }
`;

export default ContactPicPanel;
