import type { INodeProps, ITextNodeProps } from '@lightningjs/renderer';
import type { Color, TextStyle, ViewStyle } from './types';

export interface PropsConverter<IN, OUT> {
  (propIn?: IN): OUT | undefined;
}

export const toLightningColor: PropsConverter<Color | string, number> = (color) => {
  if (typeof color === 'string' && color.startsWith('#')) {
    return Number(color.replace('#', '0x') + (color.length === 7 ? 'ff' : ''));
  } else {
    console.log('Todo: Convert Color', color);
    return 0x00000000;
  }
};

export const toLightningNode: PropsConverter<ViewStyle, Omit<Partial<INodeProps>, 'shader' | 'parent'>> = (view) => {
  return {
    color: toLightningColor(view?.color),
    x: view?.x,
    y: view?.y,
    alpha: view?.alpha,
    autosize: view?.autosize,
    clipping: view?.clipping,
    colorBl: view?.colorBl,
    colorBottom: view?.colorBottom,
    colorBr: view?.colorBr,
    colorLeft: view?.colorLeft,
    colorRight: view?.colorRight,
    colorTl: view?.colorTl,
    colorTop: view?.colorTop,
    colorTr: view?.colorTr,
    height: view?.height,
    mount: view?.mount,
    mountX: view?.mountX,
    mountY: view?.mountY,
    pivot: view?.pivot,
    pivotX: view?.pivotX,
    pivotY: view?.pivotY,
    rotation: view?.rotation,
    rtt: view?.rtt,
    scale: view?.scale,
    scaleX: view?.scaleX,
    scaleY: view?.scaleY,
    src: view?.src,
    texture: view?.texture,
    textureOptions: view?.textureOptions,
    width: view?.width,
    zIndex: view?.zIndex,
    zIndexLocked: view?.zIndexLocked,
  };
};

export const toLightningTextNode: PropsConverter<TextStyle, Omit<Partial<ITextNodeProps>, 'text' | 'debug'>> = (
  text
) => {
  return {
    color: toLightningColor(text?.color),
    fontSize: text?.fontSize,
    fontFamily: text?.fontFamily,
    fontWeight: text?.fontWeight,
    fontStyle: text?.fontStyle,
    fontStretch: text?.fontStretch,
    textAlign: text?.textAlign,
    contain: text?.contain,
    width: text?.width,
    height: text?.height,
    scrollable: text?.scrollable,
    scrollY: text?.scrollY,
    offsetY: text?.offsetY,
    letterSpacing: text?.letterSpacing,
    lineHeight: text?.lineHeight,
    maxLines: text?.maxLines,
    textBaseline: text?.textBaseline,
    verticalAlign: text?.verticalAlign,
    overflowSuffix: text?.overflowSuffix,
    x: text?.x,
    y: text?.y,
  };
};
