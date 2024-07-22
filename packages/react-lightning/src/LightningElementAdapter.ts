import { isView } from './elements';
import type { Element, ElementContainer } from './types';

const crossAlignChild = (containerCrossSize: number, alignItems: string, crossAxio: string, crossDimension: string) => {
  const alignChild = (child: Element<any>, position: number): void => {
    child.style[crossAxio] = position;
  };

  return containerCrossSize && alignItems
    ? (child: Element<any>) => {
        const childSize = child.style[crossDimension] || 0;
        switch (alignItems) {
          case 'flex-start':
            alignChild(child, 0);
            break;
          case 'center':
            alignChild(child, (containerCrossSize - childSize) / 2);
            break;
          case 'flex-end':
            alignChild(child, containerCrossSize - childSize);
            break;
          default:
            break;
        }
      }
    : (child: Element<any>) => child;
};

const isTextNodeLoaded = (child: Element<any>): boolean => {
  return !(child.type === 'ln-text' && child.props.children && !(child.style?.width || child.style?.height));
};

const calculateItemSize = (children: Element<any>[], dimension: string): number => {
  return children.reduce((total, child) => total + (child.style?.[dimension] || 0), 0);
};

const getStyleValue = (style: Element<any>['style'], property: string, defaultValue: number = 0): number => {
  return style[property] || defaultValue;
};

export const toFlexbox = (element: ElementContainer<any>): boolean => {
  if (!isView(element)) {
    return false;
  }

  const children: ElementContainer<'ln-view'>['children'] = [];

  for (const child of element.children) {
    if (!isTextNodeLoaded(child)) {
      return false;
    }
    children.push(child);
  }

  const direction = element.style.flexDirection || 'row';
  const isRow = direction === 'row';
  const dimension = isRow ? 'width' : 'height';
  const crossDimension = isRow ? 'height' : 'width';
  const justifyContent = element.style.justifyContent || 'flex-start';
  const alignItems = element.style.alignItems || 'normal';
  const gap = element.style.gap || 0;

  const marginOne = isRow ? 'marginLeft' : 'marginTop';
  const marginTwo = isRow ? 'marginRight' : 'marginBottom';
  const axio = isRow ? 'x' : 'y';
  const crossAxio = isRow ? 'y' : 'x';
  const containerSize = element.style[dimension] || 0;
  const containerCrossSize = element.style[crossDimension] || 0;

  let itemSize = 0;

  if (['center', 'space-between', 'space-evenly'].includes(justifyContent)) {
    itemSize = calculateItemSize(children, dimension);
  }

  // Only align children if container has a cross size
  const alignChildFunction = crossAlignChild(containerCrossSize, alignItems, crossAxio, crossDimension);

  const alignFlexStart = (): boolean => {
    let start = 0;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child || !child.style) return false;

      child.style[axio] = start + getStyleValue(child.style, marginOne);

      start +=
        getStyleValue(child.style, dimension) +
        gap +
        getStyleValue(child.style, marginOne) +
        getStyleValue(child.style, marginTwo);

      alignChildFunction(child);
    }

    if (element.style.flexBoundary !== 'fixed') {
      const calculatedSize = start - gap;

      if (calculatedSize !== element.style[dimension]) {
        element.style[dimension] = calculatedSize;
        return true;
      }
    }
    return false;
  };

  const alignFlexEnd = (): boolean => {
    let start = containerSize;

    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (!child || !child.style) return false;

      child.style[axio] = start - getStyleValue(child.style, dimension) - getStyleValue(child.style, marginTwo);

      start -=
        getStyleValue(child.style, dimension) +
        gap +
        getStyleValue(child.style, marginOne) +
        getStyleValue(child.style, marginTwo);

      alignChildFunction(child);
    }
    return true;
  };

  const alignCenter = (): boolean => {
    let start = (containerSize - (itemSize + gap * (children.length - 1))) / 2;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child || !child.style) return false;

      child.style[axio] = start;
      start += getStyleValue(child.style, dimension) + gap;

      alignChildFunction(child);
    }
    return true;
  };

  const alignSpaceBetween = (): boolean => {
    const toPad = (containerSize - itemSize) / (children.length - 1);

    let start = 0;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child || !child.style) return false;

      child.style[axio] = start;
      start += getStyleValue(child.style, dimension) + toPad;

      alignChildFunction(child);
    }
    return true;
  };

  const alignSpaceEvenly = (): boolean => {
    const toPad = (containerSize - itemSize) / (children.length + 1);

    let start = toPad;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child || !child.style) return false;

      child.style[axio] = start;
      start += getStyleValue(child.style, dimension) + toPad;

      alignChildFunction(child);
    }
    return true;
  };

  switch (justifyContent) {
    case 'flex-start':
      return alignFlexStart();
    case 'flex-end':
      return alignFlexEnd();
    case 'center':
      return alignCenter();
    case 'space-between':
      return alignSpaceBetween();
    case 'space-evenly':
      return alignSpaceEvenly();
    default:
      return false;
  }
};
