import type { INodeProps, ITextNodeProps } from '@lightningjs/renderer';
import type { Color, ElementContainer, TextStyle, ViewStyle } from './types';
import { hexColorTransform } from './utils';

export interface PropsConverter<IN, OUT> {
  (propIn?: IN, parent?: ElementContainer<any>): OUT | undefined;
}

export const toLightningColor: PropsConverter<Color | string, number> = (color) => {
  if (typeof color === 'string' && color.startsWith('#')) {
    return hexColorTransform(color);
  } else {
    // Default color to transparent
    return 0x00000000;
  }
};

export const toLightningNode: PropsConverter<ViewStyle, Omit<Partial<INodeProps>, 'shader' | 'parent'>> = (
  view,
  parent
) => {
  let customWidth = view?.width;
  let customHeight = view?.height;

  if (parent && parent.style && view && !view.texture) {
    const { width: parentWidth = 0, height: parentHeight = 0 } = parent.style;

    if (!customWidth || isNaN(customWidth)) {
      customWidth = parentWidth - Number(view?.x) || 0;
    }

    if (!customHeight || isNaN(customHeight)) {
      customHeight = parentHeight - Number(view?.y) || 0;
    }
  }

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
    width: customWidth,
    height: customHeight,
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
