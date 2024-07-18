import type { ITextNode } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { Element, ElementContainer, ElementCreator, ElementProps, ObjectTyping, TextStyle } from '../types';
import { isView } from './View';
import { isTextNode } from '../utils';
import { toLightningTextNode } from '../LightningElementMapping';

export interface TextProps extends TextStyle, ElementProps<Text> {
  children: string;
}

export class Text implements Element<'ln-text'> {
  readonly type = 'ln-text' as const;
  readonly props: ObjectTyping['ln-text']['props'];
  node: ITextNode | undefined;

  rendered = false;
  deleted = false;

  constructor(props: ObjectTyping['ln-text']['props']) {
    this.props = props;
  }

  render(parent?: ElementContainer<any>): void {
    if (!parent || !isView(parent)) {
      throw new Error('Parent is not a view');
    }

    if (!parent.rendered) {
      throw new Error('Parent not rendered');
    }

    const lightningTextNodeBuilder = toLightningTextNode(this.props);

    this.node = renderer.createTextNode({
      parent: parent.node,
      text: this.props.children,
      ...lightningTextNodeBuilder,
    });

    this.rendered = true;
  }

  delete() {
    if (this.deleted) return;

    if (this.node && isTextNode(this.node)) {
      this.node.destroy();
      this.deleted = true;
    }
  }
}

export const createText: ElementCreator<'ln-text'> = (_, props) => new Text(props);
