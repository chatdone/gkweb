import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Grid,
  Input,
  Modal,
  Space,
  Switch,
  Table,
  Typography,
} from '@arco-design/web-react';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { escapeRegExp } from 'lodash-es';
import { useState } from 'react';
import { MdAdd, MdDelete, MdEdit, MdSearch } from 'react-icons/md';

import { ContentHeader } from '@/components';
import Message from '@/components/Message';

import {
  AddLocationModal,
  FormValues as AddLocationFormValues,
} from './AddLocationModal';
import styles from './CompanyLocationsPage.module.less';
import {
  EditLocationDrawer,
  FormValues as EditLocationFormValues,
} from './EditLocationDrawer';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getErrorMessage } from '@/utils/error.utils';

import type { ArrayElement } from '@/types';

import {
  CompanyMemberType,
  CompanyLocationsPageQuery,
  CompanyLocationsPageQueryVariables,
  CreateLocationMutation,
  CreateLocationMutationVariables,
  DeleteLocationsMutation,
  DeleteLocationsMutationVariables,
  UpdateLocationArchivedStatusMutation,
  UpdateLocationArchivedStatusMutationVariables,
  UpdateLocationMutation,
  UpdateLocationMutationVariables,
} from 'generated/graphql-types';

type QueryLocation = ArrayElement<CompanyLocationsPageQuery['locations']>;

const CompanyLocationPage = () => {
  const { activeCompany, getCurrentMember } = useAppStore();

  const currentMember = getCurrentMember();

  const {
    data: queryData,
    refetch: refetchQuery,
    loading: queryLoading,
  } = useQuery<CompanyLocationsPageQuery, CompanyLocationsPageQueryVariables>(
    companyLocationsPageQuery,
    {
      variables: {
        companyId: activeCompany?.id as string,
      },
      skip: !activeCompany?.id,
    },
  );
  const [mutateCreateLocation, { loading: mutateCreateLocationLoading }] =
    useMutation<CreateLocationMutation, CreateLocationMutationVariables>(
      createLocationMutation,
    );
  const [mutateUpdateLocation, { loading: mutateUpdateLocationLoading }] =
    useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(
      updateLocationMutation,
    );
  const [mutateUpdateLocationArchivedStatus] = useMutation<
    UpdateLocationArchivedStatusMutation,
    UpdateLocationArchivedStatusMutationVariables
  >(updateLocationArchivedStatusMutation);
  const [mutateDeleteLocations] = useMutation<
    DeleteLocationsMutation,
    DeleteLocationsMutationVariables
  >(deleteLocationsMutation);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [editLocation, setEditLocation] = useState<QueryLocation>();

  const canEdit = currentMember?.type !== CompanyMemberType.Member;

  const disclosureState = {
    addLocation: useDisclosure(),
    editLocation: useDisclosure(),
  };

  const handleUpdateSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleEditLocation = (location: QueryLocation) => {
    setEditLocation(location);

    disclosureState.editLocation.onOpen();
  };

  const handleCloseEditDrawer = () => {
    setEditLocation(undefined);

    disclosureState.editLocation.onClose();
  };

  const handleOpenDeleteLocationConfirmation = (location: QueryLocation) => {
    Modal.confirm({
      title: 'Delete Location',
      content: (
        <div style={{ textAlign: 'center' }}>
          Are you sure you want to delete this location?
        </div>
      ),
      okText: 'Confirm',
      okButtonProps: {
        style: {
          background: '#d6001c',
        },
      },
      onOk: async () => {
        await handleDeleteLocation(location);
      },
    });
  };

  const handleCreateLocation = async (values: AddLocationFormValues) => {
    if (!activeCompany?.id) {
      return;
    }

    try {
      const res = await mutateCreateLocation({
        variables: {
          companyId: activeCompany.id,
          input: {
            name: values.name.trim(),
            // radius: values.radius,
            address: values.location.formatted_address,
            lat: values.location.geometry?.location?.lat(),
            lng: values.location.geometry?.location?.lng(),
            metadata: JSON.stringify({
              googlePlaceId: values.location.place_id,
            }),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        disclosureState.addLocation.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create location',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateLocation = async (values: EditLocationFormValues) => {
    if (!editLocation?.id) {
      return;
    }

    try {
      const res = await mutateUpdateLocation({
        variables: {
          locationId: editLocation.id,
          input: {
            name: values.name.trim(),
            // radius: values.radius,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        disclosureState.editLocation.onClose();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update location',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateLocationArchivedStatus = async (
    location: QueryLocation,
    archived: boolean,
  ) => {
    if (!location?.id) {
      return;
    }

    try {
      const res = await mutateUpdateLocationArchivedStatus({
        variables: {
          locationIds: [location.id],
          archived,
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update location archived status',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLocation = async (location: QueryLocation) => {
    if (!location?.id) {
      return;
    }

    try {
      const res = await mutateDeleteLocations({
        variables: {
          locationIds: [location.id],
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete location',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnProps<QueryLocation>[] = [
    {
      title: 'Location Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Action',
      align: 'right',
      render: (col, item) => {
        return (
          <Space>
            <Button
              type="text"
              icon={<MdEdit />}
              onClick={() => handleEditLocation(item)}
            />

            <Button
              type="text"
              icon={<MdDelete />}
              onClick={() => handleOpenDeleteLocationConfirmation(item)}
            />

            <Switch
              checked={!item?.archived}
              onChange={(value) =>
                handleUpdateLocationArchivedStatus(item, !value)
              }
            />
          </Space>
        );
      },
    },
  ];

  const getData = (): QueryLocation[] => {
    let data = queryData?.locations || [];

    if (searchKeyword) {
      const regex = new RegExp(escapeRegExp(searchKeyword), 'i');

      data = data.filter(
        (location) =>
          location?.name?.match(regex) || location?.address?.match(regex),
      );
    }

    return data;
  };

  return (
    <>
      <ContentHeader
        breadcrumbItems={[
          {
            name: 'Setting',
          },
          {
            name: 'Time Attendance',
          },
          {
            name: 'Location',
          },
        ]}
      />

      <Card className={styles.wrapper}>
        <Space direction="vertical" size={20}>
          <Grid.Row justify="space-between">
            <Typography.Text className={styles.title}>
              Location ({queryData?.locations?.length || 0})
            </Typography.Text>

            <Input
              style={{ width: 362 }}
              suffix={<MdSearch />}
              placeholder="Search location"
              value={searchKeyword}
              onChange={handleUpdateSearchKeyword}
            />
          </Grid.Row>

          {canEdit && (
            <Button
              className={styles['theme-btn']}
              icon={<MdAdd />}
              onClick={disclosureState.addLocation.onOpen}
            >
              Add Location
            </Button>
          )}

          <Table
            data={getData()}
            columns={canEdit ? columns : columns.slice(0, -1)}
            border={false}
            pagination={false}
            scroll={{ x: 1000 }}
            loading={queryLoading}
          />
        </Space>
      </Card>

      <AddLocationModal
        visible={disclosureState.addLocation.visible}
        onCancel={disclosureState.addLocation.onClose}
        onSubmit={handleCreateLocation}
        loading={mutateCreateLocationLoading}
      />

      <EditLocationDrawer
        visible={disclosureState.editLocation.visible}
        onCancel={handleCloseEditDrawer}
        loading={mutateUpdateLocationLoading}
        location={editLocation}
        onSubmit={handleUpdateLocation}
      />
    </>
  );
};

const companyLocationsPageQuery = gql`
  query CompanyLocationsPage($companyId: ID!) {
    locations(companyId: $companyId) {
      id
      name
      address
      radius
      lng
      lat
      archived
    }
  }
`;

const createLocationMutation = gql`
  mutation CreateLocation($companyId: ID!, $input: CreateLocationInput!) {
    createLocation(companyId: $companyId, input: $input) {
      id
    }
  }
`;

const updateLocationMutation = gql`
  mutation UpdateLocation($locationId: ID!, $input: UpdateLocationInput!) {
    updateLocation(locationId: $locationId, input: $input) {
      id
    }
  }
`;

const deleteLocationsMutation = gql`
  mutation DeleteLocations($locationIds: [ID]!) {
    deleteLocations(locationIds: $locationIds) {
      id
    }
  }
`;

const updateLocationArchivedStatusMutation = gql`
  mutation UpdateLocationArchivedStatus(
    $locationIds: [ID]!
    $archived: Boolean!
  ) {
    updateLocationArchivedStatus(
      locationIds: $locationIds
      archived: $archived
    ) {
      id
    }
  }
`;

export default CompanyLocationPage;
