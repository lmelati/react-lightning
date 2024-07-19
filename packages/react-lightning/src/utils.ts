import { type ITextNode, type INode } from '@lightningjs/renderer';
import type { Color } from './types';

export const isFunc = (obj: unknown): obj is CallableFunction => obj instanceof Function;

export function isObject(item: unknown): item is Record<string | number | symbol, unknown> {
  return typeof item === 'object';
}

export function isArray(item: unknown): item is any[] {
  return Array.isArray(item);
}

export function isString(item: unknown): item is string {
  return typeof item === 'string';
}

export function isNumber(item: unknown): item is number {
  return typeof item === 'number';
}

export function isInteger(item: unknown): item is number {
  return Number.isInteger(item);
}

export function isNode(node: object): node is INode {
  return 'destroy' in node && typeof node.destroy === 'function';
}

export function isTextNode(node: object): node is ITextNode {
  return 'destroy' in node && typeof node.destroy === 'function';
}

// @ref: https://github.com/lightning-tv/vite-hex-transform/blob/main/index.js
export function hexColorTransform(color: string | Color | undefined) {
  // Regular expression to match all hex colors, including 3, 4, 6, and 8 character formats
  const hexColorRegex = /#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b/g;

  // Function to convert hex color string to 0xRRGGBBAA format
  const convertHexTo0x = (_match: string, p1: string) => {
    let hex = p1; // Extract the hex part from the match

    // If it's a shorthand hex color (#RGB or #RGBA), expand it to #RRGGBB or #RRGGBBAA
    if (hex.length === 3) {
      hex =
        hex
          .split('')
          .map((char: string) => char + char)
          .join('') + 'FF';
    } else if (hex.length === 4) {
      const alpha = hex[3] + hex[3];
      hex =
        hex
          .slice(0, 3)
          .split('')
          .map((char: any) => char + char)
          .join('') + alpha;
    } else if (hex.length === 6) {
      hex += 'FF'; // Append 'FF' for full opacity if no alpha is provided
    }

    // Convert to 0xRRGGBBAA format
    return `0x${hex.toUpperCase()}`;
  };

  const transformedCode = typeof color === 'string' ? color.replace(hexColorRegex, convertHexTo0x) : color;
  return Number(transformedCode);
}
