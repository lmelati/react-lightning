import type { INode, INodeProps } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { NodeCreator, NodeElement, NodeElementContainer, NodeProps, ObjectTyping } from '../types/NodeType';
import { type ReactNode } from 'react';

export interface TvViewProps extends Partial<Omit<INodeProps<any>, 'shader' | 'parent'>>, NodeProps<TvView> {
  children?: ReactNode;
}

type TvViewChild = NodeElement<'tv-view'> | NodeElement<'tv-text'>;

export class TvView implements NodeElement<'tv-view'> {
  readonly props: ObjectTyping['tv-view']['props'];
  readonly type = 'tv-view' as const;

  children: TvViewChild[] = [];
  node: INode<any> | null | undefined;
  rendered: boolean;

  constructor(props: ObjectTyping['tv-view']['props']) {
    this.props = props;
    this.rendered = false;
  }

  render(parent: NodeElementContainer<any>): void {
    this.node = renderer.createNode({
      parent: parent.node,
      ...this.props,
    });

    this.rendered = true;

    this.children.forEach((child) => child.render(this));
  }
}

export const createTvView: NodeCreator<'tv-view'> = (_, props): NodeElementContainer<'tv-view'> => {
  return new TvView(props);
};

export function isTvView(element: NodeElement<any>): element is TvView {
  return element.type === 'tv-view';
}
