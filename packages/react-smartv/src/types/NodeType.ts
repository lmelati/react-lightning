import { type MutableRefObject } from 'react';

import { createTvView, type TvViewProps, createTvText, type TvTextProps } from '../nodes';

import type { INode } from '@lightningjs/renderer';

export interface ObjectTyping {
  'tv-view': { name: 'tv-view'; props: TvViewProps };
  'tv-text': { name: 'tv-text'; props: TvTextProps };
}

export interface NodeElement<TypeName extends keyof ObjectTyping> {
  readonly type: TypeName;
  props: ObjectTyping[TypeName]['props'];
  rendered: boolean;
  node: INode<any> | null | undefined;

  render(parent: NodeElementContainer<any>): void;

  // delete(): void
}

export type NodeType = keyof ObjectTyping;

export interface NodeElementContainer<TypeName extends keyof ObjectTyping> extends NodeElement<TypeName> {
  children: NodeElement<any>[];
}

export function isContainerElement(element: NodeElement<any>): element is NodeElementContainer<any> {
  return (element as NodeElementContainer<any>).children !== undefined;
}

export type NodeProps<T> = {
  ref?: MutableRefObject<T | null | undefined>;
};

export interface NodeCreator<TypeName extends keyof ObjectTyping> {
  (type: TypeName, props: ObjectTyping[TypeName]['props']): NodeElement<TypeName>;
}

const Nodes: { [key in NodeType]: NodeCreator<any> } = {
  'tv-view': createTvView,
  'tv-text': createTvText,
};

export function createNode(type: NodeType, props?: NodeProps<any>): NodeElement<any> {
  return Nodes[type](type, props);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'tv-view': TvViewProps;
      'tv-text': TvTextProps;
    }
  }
}
