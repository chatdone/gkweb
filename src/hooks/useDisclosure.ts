import { useCallback, useState } from 'react';

const useDisclosure = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const onOpen = useCallback(() => {
    setVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, onClose, onOpen };
};

export default useDisclosure;
