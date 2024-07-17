import type { INode, INodeProps } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { Element, ElementContainer, ElementCreator, ElementProps, ObjectTyping } from '../types';
import { type ReactNode } from 'react';

export interface ViewProps extends Partial<Omit<INodeProps<any>, 'shader' | 'parent'>>, ElementProps<View> {
  children?: ReactNode;
}

type TvViewChild = Element<'ln-view'> | Element<'ln-text'>;

export class View implements Element<'ln-view'> {
  readonly props: ObjectTyping['ln-view']['props'];
  readonly type = 'ln-view' as const;

  children: TvViewChild[] = [];
  node: INode<any> | null | undefined;
  rendered: boolean;

  constructor(props: ObjectTyping['ln-view']['props']) {
    this.props = props;
    this.rendered = false;
  }

  render(parent: ElementContainer<any>): void {
    this.node = renderer.createNode({
      parent: parent.node,
      ...this.props,
    });

    this.rendered = true;

    this.children.forEach((child) => child.render(this));
  }
}

export const createView: ElementCreator<'ln-view'> = (_, props): ElementContainer<'ln-view'> => new View(props);

export function isView(element: Element<any>): element is View {
  return element.type === 'ln-view';
}
