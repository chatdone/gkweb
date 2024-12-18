import { Button, Grid, Input, Space } from '@arco-design/web-react';
import { useEffect, useRef, useState } from 'react';

import { MarkdownText } from '@/components';

import styles from './EditableText.module.less';

type Props = {
  onSave: (value: string) => void;
  value?: string | null;
  wrapperClassName?: string;
};

const EditableText = (props: Props) => {
  const { value: propValue, wrapperClassName, onSave } = props;

  const [value, setValue] = useState<string>('');
  const [editing, setEditing] = useState<boolean>(false);

  const initialValueRef = useRef<string>('');

  useEffect(() => {
    if (propValue) {
      setValue(propValue);

      initialValueRef.current = propValue;
    }
  }, [propValue]);

  const handleStartEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    onSave(value);

    setEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValueRef.current);
    setEditing(false);
  };

  return (
    <div className={wrapperClassName}>
      {editing ? (
        <Input.TextArea
          placeholder="Type description..."
          autoSize={{
            minRows: 1,
            maxRows: 6,
          }}
          value={value}
          onChange={(value) => setValue(value)}
        />
      ) : (
        <div onClick={handleStartEdit}>
          <MarkdownText className={styles.readonly} markdown={value} />
        </div>
      )}

      {editing && (
        <Grid.Row className={styles.buttons} justify="end">
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button className={styles['theme-button']} onClick={handleSave}>
              Save
            </Button>
          </Space>
        </Grid.Row>
      )}
    </div>
  );
};

export default EditableText;
