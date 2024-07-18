import { type CSSProperties, type MutableRefObject } from 'react';

import { createView, type ViewProps, createText, type TextProps } from '../elements';

import type {
  AnimationSettings,
  FadeOutEffectProps,
  GlitchEffectProps,
  GrayscaleEffectProps,
  INode,
  INodeProps,
  ITextNode,
  ITextNodeProps,
  LinearGradientEffectProps,
  RadialGradientEffectProps,
  RadialProgressEffectProps,
} from '@lightningjs/renderer';

export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

export interface LinearGradientProperties extends Omit<LinearGradientEffectProps, 'color'> {
  colors: Color[];
}

export interface RadialGradientProperties extends Omit<RadialGradientEffectProps, 'color'> {
  colors: Color[];
}

export interface RadialProgressEffectProperties extends Omit<RadialProgressEffectProps, 'color'> {
  colors: Color[];
}

export interface EffectsProperties {
  fadeOut?: FadeOutEffectProps;
  linearGradient?: LinearGradientProperties;
  radialGradient?: RadialGradientProperties;
  grayscale?: GrayscaleEffectProps;
  glitch?: GlitchEffectProps;
  radialProgress?: RadialProgressEffectProperties;
}

export interface FlexProperties
  extends Pick<CSSProperties, 'alignItems' | 'justifyContent' | 'flexDirection' | 'gap'> {}

export interface MarginProperties
  extends Pick<CSSProperties, 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'> {}

export interface BorderProperties
  extends Pick<CSSProperties, 'border' | 'borderTop' | 'borderRight' | 'borderBottom' | 'borderLeft'> {}

export interface BorderRadiusProperties extends Pick<CSSProperties, 'borderRadius'> {}

export interface ViewStyleProperties
  extends FlexProperties,
    MarginProperties,
    BorderProperties,
    BorderRadiusProperties {
  display?: 'flex' | 'block';
  effects?: EffectsProperties;
  transition?: Record<string, Partial<AnimationSettings> | true | false> | true | false;
  linearGradient?: LinearGradientProperties;
}

export interface TextStyle extends Omit<Partial<ITextNodeProps>, 'text' | 'debug' | 'color'> {
  color?: Color | string;
}

export interface ViewStyle extends Omit<Partial<INodeProps>, 'shader' | 'parent' | 'color'>, ViewStyleProperties {
  color?: Color | string;
}

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
  node: (INode<any> | ITextNode) | undefined;

  render(parent: ElementContainer<any>): void;

  delete(): void;
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
