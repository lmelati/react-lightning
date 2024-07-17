import { type MutableRefObject } from 'react';

import { createView, type ViewProps, createText, type TextProps } from '../elements';

import type { INode } from '@lightningjs/renderer';

export type ElementProps<T> = {
  ref?: MutableRefObject<T | null | undefined>;
};

export interface ObjectTyping {
  'ln-view': { name: 'ln-view'; props: ViewProps };
  'ln-text': { name: 'ln-text'; props: TextProps };
}

export type ElementType = keyof ObjectTyping;

export interface Element<TypeName extends keyof ObjectTyping> {
  readonly type: TypeName;
  props: ObjectTyping[TypeName]['props'];
  rendered: boolean;
  node: INode<any> | null | undefined;

  render(parent: ElementContainer<any>): void;

  // delete(): void
}

export interface ElementCreator<TypeName extends keyof ObjectTyping> {
  (type: TypeName, props: ObjectTyping[TypeName]['props']): Element<TypeName>;
}

export function isContainerElement(element: Element<any>): element is ElementContainer<any> {
  return (element as ElementContainer<any>).children !== undefined;
}

export interface ElementContainer<TypeName extends keyof ObjectTyping> extends Element<TypeName> {
  children: Element<any>[];
}

const Elements: { [key in ElementType]: ElementCreator<any> } = {
  'ln-view': createView,
  'ln-text': createText,
};

export function createElement(type: ElementType, props?: ElementProps<any>): Element<any> {
  return Elements[type](type, props);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ln-view': ViewProps;
      'ln-text': TextProps;
    }
  }
}
