import { get } from 'lodash-es';
import { useEffect, useState } from 'react';

import { TaskService, DedocoService } from '@/services';

import { TaskAttachment } from 'generated/graphql-types';

type Props = {
  payload: {
    attachments: (TaskAttachment | null)[];
    taskId: string;
    companyId: string;
    userId: string;
    taskBoardId: string;
  };
  onComplete: () => void;
  onFail?: () => void;
};

const DedocoVisualBuilder = (props: Props) => {
  const { payload, onComplete, onFail } = props;

  const [visualBuilderParams, setVisualBuilderParams] = useState<{
    redirect_url: string;
    workflow_id: string;
  }>();

  useEffect(() => {
    handleGetVisualBuilderParams();
  }, [payload]);

  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data === 'ddc-vb:ok') {
        onComplete();
      }
    });
  });

  useEffect(() => {
    let iframe: any;
    let iframeEvent: any;

    if (visualBuilderParams) {
      const iframe = document.getElementById('dedoco_iframe');

      iframeEvent = iframe?.addEventListener('load', () => {
        loadFilesIntoVisualBuilder();
      });
    }

    return () => {
      if (iframeEvent) {
        iframe?.removeEventListener('load', iframeEvent);
      }
    };
  }, [visualBuilderParams]);

  const handleGetVisualBuilderParams = async () => {
    try {
      const res = await DedocoService.initDocumentSigning({
        attachmentIds: payload.attachments.map(
          (attachment) => attachment?.id as string,
        ),
        companyId: payload.companyId,
        taskId: payload.taskId,
        userId: payload.userId,
        taskBoardId: payload.taskBoardId,
      });

      setVisualBuilderParams(res.data);
    } catch (error) {
      console.log(error);

      onFail?.();
    }
  };

  const getFile = async (id: string) => {
    const res = await TaskService.getTaskAttachment(id);

    const type = get(res, 'data.type') || res.headers['content-type'];
    const blob = new Blob([res.data], { type });

    return blob;
  };

  const loadFilesIntoVisualBuilder = async () => {
    try {
      const blobFiles = await Promise.all(
        payload.attachments.map((attachment) =>
          getFile(attachment?.id as string),
        ),
      );

      const iframe = document.getElementById(
        'dedoco_iframe',
      ) as HTMLIFrameElement;

      if (iframe) {
        blobFiles.forEach((file, index) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            iframe?.contentWindow?.postMessage(
              {
                subject: 'file',
                data: reader.result,
                name: payload.attachments[index]?.name,
              },
              '*',
            );
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <iframe
      id="dedoco_iframe"
      title="Signature Visual Builder"
      style={{ minHeight: '80vh', width: '100%', margin: 'auto' }}
      src={visualBuilderParams?.redirect_url}
    />
  );
};

export default DedocoVisualBuilder;
