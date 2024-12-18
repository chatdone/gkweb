import { Button, Notification } from '@arco-design/web-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const intervalMS = 60 * 60 * 1000;

const ReloadPrompt = () => {
  const {
    offlineReady: [, setOfflineReady],
    needRefresh: [, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);

      r &&
        setInterval(() => {
          r.update();
        }, intervalMS);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onNeedRefresh: () => {
      handleNotifyNewContent();
    },
  });

  const handleNotifyNewContent = () => {
    const id = `${Date.now()}`;

    Notification.info({
      id,
      title: 'New Version Available',
      content: 'Click on reload button to update',
      duration: 0,
      position: 'bottomRight',
      btn: (
        <span>
          <Button
            className="mx-3"
            size="small"
            onClick={() => {
              handleClose();

              Notification.remove(id);
            }}
          >
            Cancel
          </Button>

          <Button type="primary" size="small" onClick={handleReload}>
            Reload
          </Button>
        </span>
      ),
    });
  };

  const handleReload = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return <></>;
};

export default ReloadPrompt;
