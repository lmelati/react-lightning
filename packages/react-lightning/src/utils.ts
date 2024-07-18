import { type ITextNode, type INode } from '@lightningjs/renderer';

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
