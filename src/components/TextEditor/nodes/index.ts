import { Class } from 'utility-types';
import type { LexicalNode } from 'lexical';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { MentionNode } from './MentionNode';

const nodes: Array<Class<LexicalNode>> = [
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  MentionNode,
];

export default nodes;
