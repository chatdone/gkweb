import { gql, useMutation } from '@apollo/client';
import { Button, Radio, Tooltip } from '@arco-design/web-react';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import Message from '@/components/Message';
import Modal from '@/components/Modal';
import type { CascaderOption } from '@/components/SelectUserCascaderInput';

import ClaimList, { EditClaimFormValues } from './ClaimList';
import InvoiceList from './InvoiceList';
import { FormValues as InvoiceItemFormValues } from './InvoiceList/EditInvoiceItemModal';
import EditInvoiceModal, {
  FormValues as InvoiceFormValues,
} from './InvoiceList/EditInvoiceModal';
import { FormValues as InvoicePaymentFormValues } from './InvoiceList/EditInvoicePaymentModal';
import TimeCostList, {
  AddTimeCostEntryFormValues,
  AddTimeCostFormValues,
} from './TimeCostList';

import { useDisclosure } from '@/hooks';
import { useAppStore } from '@/stores/useAppStore';

import { getUTC } from '@/utils/date.utils';
import { getErrorMessage } from '@/utils/error.utils';

import { navigateCompanySubscriptionsPage } from '@/navigation';

import { ArrayElement, SelectOption } from '@/types';

import {
  CompanyMemberType,
  ProjectPageQuery,
  CreateBillingInvoiceMutation,
  CreateBillingInvoiceMutationVariables,
  UpdateBillingInvoiceMutation,
  UpdateBillingInvoiceMutationVariables,
  DeleteBillingInvoicesMutation,
  DeleteBillingInvoicesMutationVariables,
  CreateBillingInvoiceItemMutation,
  CreateBillingInvoiceItemMutationVariables,
  UpdateBillingInvoiceItemMutation,
  UpdateBillingInvoiceItemMutationVariables,
  DeleteBillingInvoiceItemsMutation,
  DeleteBillingInvoiceItemsMutationVariables,
  ReceivePaymentInvoiceMutation,
  ReceivePaymentInvoiceMutationVariables,
  VoidInvoiceMutation,
  VoidInvoiceMutationVariables,
  SendInvoiceMutation,
  SendInvoiceMutationVariables,
} from 'generated/graphql-types';

type QueryInvoice = ArrayElement<ProjectPageQuery['billingInvoices']>;

type QueryInvoiceItem = ArrayElement<NonNullable<QueryInvoice>['items']>;

type View = 'invoice' | 'claims' | 'time-cost';

type Props = {
  projectId: string | undefined;
  invoices: ProjectPageQuery['billingInvoices'];
  contacts: ProjectPageQuery['contacts'];
  taskOptions: SelectOption[];
  companyMemberOptions: SelectOption[];
  refetchQuery: () => void;
};

const BillingView = (props: Props) => {
  const {
    projectId,
    invoices,
    contacts,
    taskOptions,
    companyMemberOptions,
    refetchQuery,
  } = props;

  const navigate = useNavigate();

  const { activeCompany, getCurrentMember, reloadUser } = useAppStore();

  const [
    mutateCreateBillingInvoice,
    { loading: mutateCreateBillingInvoiceLoading },
  ] = useMutation<
    CreateBillingInvoiceMutation,
    CreateBillingInvoiceMutationVariables
  >(createBillingInvoiceMutation);
  const [
    mutateUpdateBillingInvoice,
    { loading: mutateUpdateBillingInvoiceLoading },
  ] = useMutation<
    UpdateBillingInvoiceMutation,
    UpdateBillingInvoiceMutationVariables
  >(updateBillingInvoiceMutation);
  const [mutateDeleteBillingInvoices] = useMutation<
    DeleteBillingInvoicesMutation,
    DeleteBillingInvoicesMutationVariables
  >(deleteBillingInvoicesMutation);
  const [
    mutateCreateBillingInvoiceItem,
    { loading: mutateCreateBillingInvoiceItemLoading },
  ] = useMutation<
    CreateBillingInvoiceItemMutation,
    CreateBillingInvoiceItemMutationVariables
  >(createBillingInvoiceItemMutation);
  const [
    mutateUpdateBillingInvoiceItem,
    { loading: mutateUpdateBillingInvoiceItemLoading },
  ] = useMutation<
    UpdateBillingInvoiceItemMutation,
    UpdateBillingInvoiceItemMutationVariables
  >(updateBillingInvoiceItemMutation);
  const [mutateDeleteBillingInvoiceItems] = useMutation<
    DeleteBillingInvoiceItemsMutation,
    DeleteBillingInvoiceItemsMutationVariables
  >(deleteBillingInvoiceItemsMutation);
  const [
    mutateReceivePaymentInvoice,
    { loading: mutateReceivePaymentInvoiceLoading },
  ] = useMutation<
    ReceivePaymentInvoiceMutation,
    ReceivePaymentInvoiceMutationVariables
  >(receivePaymentInvoiceMutation);
  const [mutateVoidInvoice] = useMutation<
    VoidInvoiceMutation,
    VoidInvoiceMutationVariables
  >(voidInvoiceMutation);
  const [mutateSendInvoice] = useMutation<
    SendInvoiceMutation,
    SendInvoiceMutationVariables
  >(sendInvoiceMutation);

  const [view, setView] = useState<View>('invoice');
  const [showInvoiceButton, setShowInvoiceButton] = useState<boolean>(true);
  const [editInvoice, setEditInvoice] = useState<QueryInvoice>();

  const modalState = {
    invoice: useDisclosure(),
  };

  const handleChangeView = (value: View) => {
    setView(value);
  };

  const handleEditInvoice = (invoice: QueryInvoice) => {
    setEditInvoice(invoice);

    modalState.invoice.onOpen();
  };

  const handleCloseInvoiceModal = () => {
    setEditInvoice(undefined);

    modalState.invoice.onClose();
  };

  const handleOpenDeleteInvoiceConfirmation = (
    invoice: QueryInvoice,
    callback: () => void,
  ) => {
    Modal.confirmV2({
      title: 'Delete Invoice',
      content: 'Do you want to delete this invoice?',
      okText: 'Delete Invoice',
      onConfirm: async () => {
        await handleDeleteInvoice(invoice);

        callback();
      },
    });
  };

  const handleOpenVoidInvoiceConfirmation = (
    invoice: QueryInvoice,
    callback: () => void,
  ) => {
    Modal.confirmV2({
      title: 'Void Invoice',
      content: 'Do you want to void this invoice?',
      okText: 'Void Invoice',
      onConfirm: async () => {
        await handleVoidInvoice(invoice);

        callback();
      },
    });
  };

  const handleOpenSendInvoiceConfirmation = (invoice: QueryInvoice) => {
    Modal.confirmV2({
      title: 'Send Invoice',
      content: `Do you want to send this invoice to ${invoice?.contactPic?.name}?`,
      okText: 'Send Invoice',
      onConfirm: async () => {
        await handleSendInvoice(invoice);
      },
    });
  };

  const handleOpenDeleteInvoiceItemConfirmation = (
    item: QueryInvoiceItem,
    callback: () => void,
  ) => {
    Modal.confirmV2({
      title: 'Delete Item',
      content: 'Do you want to delete this item?',
      okText: 'Delete Item',
      onConfirm: async () => {
        await handleDeleteInvoiceItem(item);

        callback();
      },
    });
  };

  const handleOpenDeleteClaimConfirmation = (claim: unknown) => {
    Modal.confirmV2({
      title: 'Delete Claim',
      content: 'Do you want to delete this claim?',
      okText: 'Delete Claim',
      onConfirm: async () => {
        await handleDeleteClaim(claim);
      },
    });
  };

  const handleBeforeAddInvoice = () => {
    if (activeCompany?.currentSubscription?.invoiceQuota === 0) {
      const currentMember = getCurrentMember();

      Modal.info({
        title: 'Reached Plan Limit',
        content:
          currentMember?.type === CompanyMemberType.Admin
            ? 'You have reached your quota for number of invoice, please upgrade your plan'
            : 'You have reached your quota for number of invoice, please upgrade your plan or contact your admin',
        okText:
          currentMember?.type === CompanyMemberType.Admin
            ? 'Upgrade Plan'
            : undefined,
        onConfirm: () => {
          activeCompany.slug &&
            navigateCompanySubscriptionsPage({
              navigate,
              companySlug: activeCompany.slug,
            });
        },
      });
    } else {
      modalState.invoice.onOpen();
    }
  };

  const handleCreateInvoice = async (values: InvoiceFormValues) => {
    if (!projectId) {
      return;
    }

    try {
      const res = await mutateCreateBillingInvoice({
        variables: {
          input: {
            projectId,
            picId: values.customerId[1],
            docDate: getUTC(values.date),
            terms: values.terms,
            remarks: values?.remarks,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
        reloadUser();

        handleCloseInvoiceModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create invoice',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateInvoice = async (values: InvoiceFormValues) => {
    if (!editInvoice?.id) {
      return;
    }

    try {
      const res = await mutateUpdateBillingInvoice({
        variables: {
          input: {
            billingInvoiceId: editInvoice.id,
            picId: values.customerId[1],
            docDate: getUTC(values.date),
            terms: values.terms,
            remarks: values?.remarks,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();

        handleCloseInvoiceModal();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update invoice',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendInvoice = async (invoice: QueryInvoice) => {
    if (!invoice?.id) {
      return;
    }

    try {
      const res = await mutateSendInvoice({
        variables: {
          input: {
            invoiceId: invoice.id,
          },
        },
      });

      if (!res.errors) {
        Message.success(
          `The invoice has been successfully sent to ${invoice.contactPic?.name}`,
        );

        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to send invoice',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVoidInvoice = async (invoice: QueryInvoice) => {
    if (!invoice?.id) {
      return;
    }

    try {
      const res = await mutateVoidInvoice({
        variables: {
          input: {
            invoiceId: invoice.id,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to void invoice',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteInvoice = async (invoice: QueryInvoice) => {
    if (!invoice?.id) {
      return;
    }

    try {
      const res = await mutateDeleteBillingInvoices({
        variables: {
          ids: [invoice.id],
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete invoice',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateInvoiceItem = async (
    invoice: QueryInvoice,
    values: InvoiceItemFormValues,
  ) => {
    if (!invoice?.id) {
      return;
    }

    try {
      const res = await mutateCreateBillingInvoiceItem({
        variables: {
          input: {
            invoiceId: invoice.id,
            taskId: values.type === 'task' ? values.description : undefined,
            customName:
              values.type === 'custom' ? values.description.trim() : undefined,
            unitPrice: values.value,
            discountPercentage: values.discountPercent,
            taxPercentage: values.taxPercent,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create invoice item',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateInvoiceItem = async (
    item: QueryInvoiceItem,
    values: InvoiceItemFormValues,
  ) => {
    if (!item?.id) {
      return;
    }

    try {
      const res = await mutateUpdateBillingInvoiceItem({
        variables: {
          input: {
            invoiceItemId: item.id,
            taskId: values.type === 'task' ? values.description : undefined,
            itemName: values.type === 'custom' ? values.description : undefined,
            unitPrice: values.value,
            taxPercentage: values.taxPercent,
            discountPercentage: values.discountPercent,
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to update invoice item',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteInvoiceItem = async (item: QueryInvoiceItem) => {
    if (!item?.id) {
      return;
    }

    try {
      const res = await mutateDeleteBillingInvoiceItems({
        variables: {
          ids: [item.id],
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to delete invoice item',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateInvoicePayment = async (
    invoice: QueryInvoice,
    values: InvoicePaymentFormValues,
  ) => {
    if (!invoice?.id) {
      return;
    }

    try {
      const res = await mutateReceivePaymentInvoice({
        variables: {
          input: {
            invoiceId: invoice.id,
            received: values.amount,
            date: getUTC(values.date),
          },
        },
      });

      if (!res.errors) {
        refetchQuery();
      } else {
        Message.error(getErrorMessage(res.errors), {
          title: 'Failed to create received payment',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateClaim = async (values: EditClaimFormValues) => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateClaim = async (
    claim: unknown,
    values: EditClaimFormValues,
  ) => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClaim = async (claim: unknown) => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTimeCostEntry = async (values: AddTimeCostEntryFormValues) => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTimeCost = async (
    entry: unknown,
    values: AddTimeCostFormValues,
  ) => {
    try {
      //
    } catch (error) {
      console.error(error);
    }
  };

  const getContactCascaderOptions = (): CascaderOption[] => {
    if (!contacts) {
      return [];
    }

    return contacts.map((contact) => ({
      label: contact?.name as string,
      value: contact?.id as string,
      children:
        contact?.pics?.map((pic) => ({
          label: pic?.name as string,
          value: pic?.id as string,
        })) || [],
    }));
  };

  return (
    <>
      <div className="flex h-12 items-center border-b border-gray-300 px-2">
        <Radio.Group
          className="flex-1"
          type="button"
          size="small"
          options={[
            {
              label: 'Invoices',
              value: 'invoice',
            },
            // {
            //   label: <Tooltip content="Coming Soon">Quotations</Tooltip>,
            //   value: 'quotation',
            //   disabled: true,
            // },
          ]}
          value={view}
          onChange={handleChangeView}
        />

        {view === 'invoice' && showInvoiceButton && (
          <Button
            type="primary"
            size="small"
            icon={<MdAdd />}
            onClick={handleBeforeAddInvoice}
          >
            Invoice
          </Button>
        )}
      </div>

      <div className="overflow-auto bg-gray-50 p-3">
        {view === 'invoice' && (
          <InvoiceList
            invoices={invoices}
            itemLoading={
              mutateCreateBillingInvoiceItemLoading ||
              mutateUpdateBillingInvoiceItemLoading
            }
            paymentLoading={mutateReceivePaymentInvoiceLoading}
            taskOptions={taskOptions}
            onEditInvoice={handleEditInvoice}
            onShowDetails={(visible) => setShowInvoiceButton(!visible)}
            onVoidInvoice={handleOpenVoidInvoiceConfirmation}
            onSendInvoice={handleOpenSendInvoiceConfirmation}
            onDeleteInvoice={handleOpenDeleteInvoiceConfirmation}
            onAddInvoiceItem={handleCreateInvoiceItem}
            onUpdateInvoiceItem={handleUpdateInvoiceItem}
            onDeleteInvoiceItem={handleOpenDeleteInvoiceItemConfirmation}
            onCreateInvoicePayment={handleCreateInvoicePayment}
          />
        )}
        {view === 'claims' && (
          <ClaimList
            taskOptions={taskOptions}
            onCreate={handleCreateClaim}
            onUpdate={handleUpdateClaim}
            onDelete={handleOpenDeleteClaimConfirmation}
          />
        )}
        {view === 'time-cost' && (
          <TimeCostList
            taskOptions={taskOptions}
            companyMemberOptions={companyMemberOptions}
            onAddEntry={handleAddTimeCostEntry}
            onAddTimeCost={handleAddTimeCost}
          />
        )}
      </div>

      <EditInvoiceModal
        visible={modalState.invoice.visible}
        onCancel={handleCloseInvoiceModal}
        invoice={editInvoice}
        loading={
          mutateCreateBillingInvoiceLoading || mutateUpdateBillingInvoiceLoading
        }
        customerOptions={getContactCascaderOptions()}
        onCreate={handleCreateInvoice}
        onUpdate={handleUpdateInvoice}
      />
    </>
  );
};

const createBillingInvoiceMutation = gql`
  mutation CreateBillingInvoice($input: CreateBillingInvoiceInput!) {
    createBillingInvoice(input: $input) {
      id
    }
  }
`;

const updateBillingInvoiceMutation = gql`
  mutation UpdateBillingInvoice($input: UpdateBillingInvoiceInput!) {
    updateBillingInvoice(input: $input) {
      id
    }
  }
`;

const deleteBillingInvoicesMutation = gql`
  mutation DeleteBillingInvoices($ids: [ID!]!) {
    deleteBillingInvoices(ids: $ids) {
      id
    }
  }
`;

const createBillingInvoiceItemMutation = gql`
  mutation CreateBillingInvoiceItem($input: CreateBillingInvoiceItemInput!) {
    createBillingInvoiceItem(input: $input) {
      id
    }
  }
`;

const updateBillingInvoiceItemMutation = gql`
  mutation UpdateBillingInvoiceItem($input: UpdateBillingInvoiceItemInput!) {
    updateBillingInvoiceItem(input: $input) {
      id
    }
  }
`;

const deleteBillingInvoiceItemsMutation = gql`
  mutation DeleteBillingInvoiceItems($ids: [ID!]!) {
    deleteBillingInvoiceItems(ids: $ids) {
      id
    }
  }
`;

const receivePaymentInvoiceMutation = gql`
  mutation ReceivePaymentInvoice($input: ReceivePaymentInvoiceInput!) {
    receivePaymentInvoice(input: $input) {
      id
    }
  }
`;

const voidInvoiceMutation = gql`
  mutation VoidInvoice($input: VoidInvoiceInput!) {
    voidInvoice(input: $input) {
      id
    }
  }
`;

const sendInvoiceMutation = gql`
  mutation SendInvoice($input: SendInvoiceInput!) {
    sendInvoice(input: $input) {
      id
    }
  }
`;

export default BillingView;
