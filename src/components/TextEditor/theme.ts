import type { EditorThemeClasses } from 'lexical';

import styles from './theme.module.less';

const theme: EditorThemeClasses = {
  link: styles.link,
  text: {
    bold: styles.textBold,
    italic: styles.textItalic,
    underline: styles.textUnderline,
  },
};

export default theme;
