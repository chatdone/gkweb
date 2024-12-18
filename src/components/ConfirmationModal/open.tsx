import { useState } from 'react';
import ReactDOM from 'react-dom/client';

import ConfirmationModal, { Config } from './ConfirmationModal';

type OpenConfig = Omit<Config, 'afterClose'>;

const open = (config: OpenConfig) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroy = () => {
    if (div) {
      div.remove();
    }
  };

  const Element = (props: Config) => {
    const [visible, setVisible] = useState<boolean>(true);

    return (
      <ConfirmationModal
        {...props}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      />
    );
  };

  const render = (props: OpenConfig) => {
    const root = ReactDOM.createRoot(div);

    root.render(
      <Element
        {...props}
        afterClose={() => {
          setTimeout(() => {
            root.unmount();
            destroy();
          }, 100);
        }}
      />,
    );
  };

  render(config);
};

export default open;
