import type { INode } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { Element, ElementContainer, ElementCreator, ElementProps, ObjectTyping, ViewStyle } from '../types';
import { type ReactNode } from 'react';
import { isNode } from '../utils';
import { toLightningNode } from '../LightningElementMapping';

export interface ViewProps extends ViewStyle, ElementProps<View> {
  children?: ReactNode;
}

type TvViewChild = Element<'ln-view'> | Element<'ln-text'>;

export class View implements Element<'ln-view'> {
  props: ObjectTyping['ln-view']['props'];
  readonly type = 'ln-view' as const;
  children: TvViewChild[] = [];
  node: INode<any> | undefined;

  rendered = false;
  deleted = false;

  constructor(props: ObjectTyping['ln-view']['props']) {
    this.props = props;
  }

  render(parent: ElementContainer<any>): void {
    if (this.deleted) {
      throw new Error('view element deleted.');
    }

    if (!parent.node || !isNode(parent.node)) {
      throw new Error('Parent is not a node element');
    }

    const lightningNodeBuilder = toLightningNode(this.props);

    this.node = renderer.createNode({
      parent: parent.node,
      ...lightningNodeBuilder,
    });
    this.rendered = true;
    this.children.forEach((child) => child.render(this));
  }

  delete() {
    if (this.deleted) return;

    if (this.node && isNode(this.node)) {
      this.node.destroy();
      this.deleted = true;
    }
  }

  get hasChildren() {
    return this.children.length > 0;
  }
}

export const createView: ElementCreator<'ln-view'> = (_, props): ElementContainer<'ln-view'> => new View(props);

export function isView(element: Element<any>): element is View {
  return element.type === 'ln-view';
}
