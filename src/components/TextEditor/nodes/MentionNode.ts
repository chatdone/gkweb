/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Spread } from 'lexical';
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from 'lexical';

import type { Mention } from '../plugins/MentionPlugin';

export type SerializedMentionNode = Spread<
  {
    mention: Mention;
    type: 'mention';
    version: 1;
  },
  SerializedTextNode
>;

function convertMentionElement(domNode: HTMLElement): DOMConversionOutput {
  const node = $createMentionNode({
    id: domNode.textContent as string,
    name: domNode.textContent as string,
  });
  return {
    node,
  };
}

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';
export class MentionNode extends TextNode {
  __mention: Mention;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.mention);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mention: Mention, text?: string, key?: NodeKey) {
    super(text ?? mention.name, key);
    this.__mention = mention;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mention: this.__mention,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      // @ts-ignore - copy-paste from the library code
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createMentionNode(mention: Mention): MentionNode {
  const mentionNode = new MentionNode(mention);
  mentionNode.setMode('segmented').toggleDirectionless();
  return mentionNode;
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
