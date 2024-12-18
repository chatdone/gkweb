import { Dropdown, Menu } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import { MdAdd } from 'react-icons/md';

type Props = {
  onAddTask: () => void;
  onAddGroup: () => void;
  onImport: () => void;
};

const AddTaskButtonDropdown = (props: Props) => {
  const { onAddGroup, onAddTask, onImport } = props;

  const handleClickMenuItem = (key: string) => {
    if (key === 'group') {
      onAddGroup();
    } else if (key === 'import') {
      onImport();
    }
  };

  return (
    <Dropdown.Button
      type="primary"
      droplist={
        <Menu onClickMenuItem={handleClickMenuItem}>
          <Menu.Item key="group">Add group</Menu.Item>
          <Menu.Item key="import">Import tasks</Menu.Item>
        </Menu>
      }
      trigger="click"
      icon={<IconDown />}
      size="small"
      onClick={onAddTask}
    >
      <MdAdd /> Task
    </Dropdown.Button>
  );
};

export default AddTaskButtonDropdown;
