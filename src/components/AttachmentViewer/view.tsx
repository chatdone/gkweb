import ReactDOM from 'react-dom/client';

import AttachmentViewer, { AttachmentViewerProps } from './AttachmentViewer';

const view = (config: AttachmentViewerProps) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroy = () => {
    if (div) {
      div.remove();
    }
  };

  const render = (props: AttachmentViewerProps) => {
    const root = ReactDOM.createRoot(div);

    root.render(
      <AttachmentViewer
        {...props}
        visible={true}
        onCancel={() => {
          root.unmount();
          destroy();
        }}
      />,
    );
  };

  render(config);
};

export default view;
