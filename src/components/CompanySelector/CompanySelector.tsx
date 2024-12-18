import { gql, useMutation } from '@apollo/client';
import { Dropdown, Menu, Typography } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import AddCompanyModal, { FormValues } from '../AddCompanyModal';
import Avatar from '../Avatar';
import Message from '../Message';
import styles from './CompanySelector.module.less';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import { navigateHomePage } from '@/navigation';

import {
  CreateCompanyMutation,
  CreateCompanyMutationVariables,
  UpdateCompanyTimezoneMutation,
  UpdateCompanyTimezoneMutationVariables,
  UploadCompanyProfileImageMutation,
  UploadCompanyProfileImageMutationVariables,
} from 'generated/graphql-types';

type Props = {
  collapsed: boolean;
};

const CompanySelector = (props: Props) => {
  const { collapsed } = props;

  const navigate = useNavigate();

  const { currentUser, activeCompany, setActiveCompany, reloadUser } =
    useAppStore();

  const [mutateCreateCompany] = useMutation<
    CreateCompanyMutation,
    CreateCompanyMutationVariables
  >(createCompanyMutation);
  const [mutateUpdateCompanyTimezone] = useMutation<
    UpdateCompanyTimezoneMutation,
    UpdateCompanyTimezoneMutationVariables
  >(updateCompanyTimezoneMutation);
  const [mutateUploadCompanyProfileImage] = useMutation<
    UploadCompanyProfileImageMutation,
    UploadCompanyProfileImageMutationVariables
  >(uploadCompanyProfileImageMutation);

  const [createCompanyLoading, setCreateCompanyLoading] =
    useState<boolean>(false);

  const { visible, onClose, onOpen } = useDisclosure();

  const handleClickMenuItem = (key: string) => {
    if (key === 'add-company') {
      onOpen();
    } else {
      const company = currentUser?.companies?.find(
        (company) => company?.id === key,
      );

      if (company?.slug) {
        setActiveCompany(company);
        navigateHomePage(navigate, company.slug);
      }
    }
  };

  const handleCreateCompany = async (values: FormValues) => {
    setCreateCompanyLoading(true);

    try {
      const res = await mutateCreateCompany({
        variables: {
          input: {
            name: values.name,
            description: values.description,
          },
        },
      });

      if (!res.errors) {
        if (res.data?.createCompany?.id) {
          if (values.timezone) {
            await handleUpdateCompanyTimezone(
              res.data.createCompany.id,
              values.timezone,
            );
          }

          if (values.logo) {
            await handleUploadCompanyLogo(
              res.data.createCompany.id,
              values.logo,
            );
          }
        }

        Message.success(
          'Now you can start your new journey with GoKudos! Go to setting to complete setup and invite members.',
          {
            title: 'Company has been created successfully',
          },
        );

        onClose();

        reloadUser();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create company',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreateCompanyLoading(false);
    }
  };

  const handleUploadCompanyLogo = async (companyId: string, file: File) => {
    try {
      const res = await mutateUploadCompanyProfileImage({
        variables: {
          attachment: file,
          companyId,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to upload company logo',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCompanyTimezone = async (
    companyId: string,
    timezone: string,
  ) => {
    try {
      const res = await mutateUpdateCompanyTimezone({
        variables: {
          companyId,
          timezone,
        },
      });

      if (res.errors) {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update company timezone',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const dropList = (
    <Menu className="w-72" onClickMenuItem={handleClickMenuItem}>
      {currentUser?.companies?.map((company) => {
        const currentUserId = currentUser?.id;

        const companyMember = company?.members?.find(
          (member) => member?.user?.id == currentUserId,
        );

        const isCompanyMemberActiveInCompany = companyMember?.active;

        if (isCompanyMemberActiveInCompany) {
          return (
            <Menu.Item
              key={`${company?.id}`}
              className="flex h-12 items-center"
            >
              <Avatar
                size={32}
                shape="square"
                name={company?.name}
                imageSrc={company?.logoUrl}
              />

              <div className="menu-text">{company?.name}</div>
            </Menu.Item>
          );
        }
      })}

      <hr className="my-2" />

      <Menu.Item key="add-company">
        <MdAdd className="h-4 w-4 align-[-2px]" />{' '}
        <Typography.Text className="menu-text">Add company</Typography.Text>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="p-2">
        <Dropdown trigger="click" droplist={dropList}>
          <div className="menu border">
            <Avatar
              shape="square"
              size={32}
              name={activeCompany?.name}
              imageSrc={activeCompany?.logoUrl}
            />

            {!collapsed && (
              <>
                <div className="menu-text">{activeCompany?.name}</div>
                <IconDown />
              </>
            )}
          </div>
        </Dropdown>
      </div>

      <AddCompanyModal
        visible={visible}
        onCancel={onClose}
        loading={createCompanyLoading}
        onSubmit={handleCreateCompany}
      />
    </>
  );
};

const createCompanyMutation = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
    }
  }
`;

const updateCompanyTimezoneMutation = gql`
  mutation UpdateCompanyTimezone($companyId: ID!, $timezone: String!) {
    updateCompanyTimezone(companyId: $companyId, timezone: $timezone)
  }
`;

const uploadCompanyProfileImageMutation = gql`
  mutation UploadCompanyProfileImage($companyId: ID!, $attachment: Upload!) {
    uploadCompanyProfileImage(companyId: $companyId, attachment: $attachment) {
      id
    }
  }
`;

export default CompanySelector;
