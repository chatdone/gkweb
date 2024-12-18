import { Button, Tag } from '@arco-design/web-react';
import { head } from 'lodash-es';

import { Avatar } from '@/components';
import Message from '@/components/Message';

import { DedocoService } from '@/services';

import { Base64URLObject } from '@/utils/dedoco.utils';
import { getErrorMessage } from '@/utils/error.utils';

type Props = {
  documents: { [key: string]: unknown }[];
  onCancelSigning: (payload: {
    document: { [key: string]: unknown };
    workflowId: string;
  }) => void;
};

type WorkflowProps = {
  data: {
    business_processes: {
      signers: { signer_name: string; sequence_number: number }[];
      is_sequential: boolean;
    }[];
  };
  documentData: { id: number; name: string }[];
  signers: {
    signer: {
      document_id: string;
      name: string;
      status: number;
      document: { path: string };
    }[];
  };
  status: number;
  id: string;
};
const DedocoPanel = (props: Props) => {
  const { documents, onCancelSigning } = props;

  const handlePreviewAttachment = async (path: string) => {
    try {
      const res = await DedocoService.getDocument({ path });

      const base64str = res.data.file;
      const contentType = 'application/pdf';
      const url = await Base64URLObject({ base64str, contentType });

      window.open(url, '_blank');
    } catch (error) {
      Message.error(getErrorMessage(error), {
        title: 'Failed to retrieve attachment.',
      });
    }
  };

  return (
    <div className="m-2 p-2">
      {documents.map((workflow, index) => (
        <WorkflowItem
          key={index}
          workflow={workflow as WorkflowProps}
          onPreview={handlePreviewAttachment}
          onVoid={onCancelSigning}
        />
      ))}
    </div>
  );
};

const WorkflowItem = ({
  workflow,
  onPreview,
  onVoid,
}: {
  workflow: WorkflowProps;
  onPreview: (documentPath: string) => void;
  onVoid: (payload: {
    document: { [key: string]: unknown };
    workflowId: string;
  }) => void;
}) => {
  const tagColor: { [key: number]: string } = {
    1: 'orange', // pending
    2: 'green', // completed
    3: 'red', // void maybe
  };

  const getPreviousSignee = (name: string) => {
    const sequence = head(
      workflow.data.business_processes[0].signers.filter(
        (s) => s.signer_name === name,
      ),
    );

    const sequenceNumber = sequence?.sequence_number;

    if (sequenceNumber === 1) {
      return 'Pending';
    } else {
      const precedingSignerSequence = +(sequenceNumber || 0) - 1;

      const precedingSigner = head(
        workflow.data.business_processes[0].signers.filter(
          (s) => s.sequence_number === precedingSignerSequence,
        ),
      );

      const signerName = precedingSigner?.signer_name;

      return `Awaiting Signature from ${signerName}`;
    }
  };

  return (
    <>
      {workflow.documentData.map((document) => {
        const filteredSigner = workflow.signers.signer.filter(
          (s) => parseInt(s.document_id) === document.id,
        );

        return (
          <div className="mb-2 rounded border border-gray-200 bg-white p-2">
            <div className="flex justify-between py-2">
              <div className="flex items-center">
                <div>{document.name}</div>

                <div className="px-2">
                  <Tag bordered size="small" color={tagColor[workflow.status]}>
                    {workflow.status === 1 ? 'Pending' : 'Completed'}
                  </Tag>
                </div>
              </div>

              {workflow.status === 1 && (
                <Button
                  size="mini"
                  type="primary"
                  onClick={() =>
                    onVoid({
                      document: document,
                      workflowId: workflow.id,
                    })
                  }
                >
                  Void Process
                </Button>
              )}
            </div>

            {filteredSigner.map((signer, index: number) => (
              <div
                key={index}
                className="mb-2 flex rounded border border-gray-200 bg-gray-50 p-2"
              >
                <Avatar size={24} name={signer.name} />

                <div className="ml-4 flex-1">
                  <div className="flex">
                    <div>{signer.name}</div>

                    <div className="px-2">
                      <Tag
                        bordered
                        size="small"
                        color={tagColor[+signer.status]}
                      >
                        {workflow.data.business_processes[0].is_sequential
                          ? getPreviousSignee(signer.name)
                          : +signer.status === 2
                          ? 'Completed'
                          : 'Pending'}
                      </Tag>
                    </div>
                  </div>
                </div>

                {+signer.status === 2 && (
                  <Button
                    size={'mini'}
                    status="default"
                    onClick={() => onPreview(signer.document.path)}
                  >
                    View Document
                  </Button>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

export default DedocoPanel;
