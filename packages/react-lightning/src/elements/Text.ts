import type { ITextNode } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { Element, ElementContainer, ElementCreator, ElementProps, ObjectTyping, TextStyle } from '../types';
import { isView } from './View';
import { isTextNode } from '../utils';
import { toLightningTextNode } from '../LightningElementMapping';

export interface TextProps extends ElementProps<Text> {
  style?: TextStyle | undefined;
  children: string;
}

export class Text implements Element<'ln-text'> {
  readonly type = 'ln-text' as const;

  private _parent: ElementContainer<any> | undefined;

  props: ObjectTyping['ln-text']['props'];
  node: ITextNode | undefined;

  rendered = false;
  deleted = false;

  constructor(props: ObjectTyping['ln-text']['props']) {
    this.props = props;
  }

  private checkIfDeleted(): void {
    if (this.deleted) {
      throw new Error('View element deleted.');
    }
  }

  private createRenderNode(parent: ElementContainer<any>): void {
    const lightningTextNodeBuilder = toLightningTextNode(this.style);
    this.node = renderer.createTextNode({
      parent: parent.node,
      text: this.props.children,
      ...lightningTextNodeBuilder,
    });
    this.rendered = true;
  }

  render(parent?: ElementContainer<any>): void {
    this.checkIfDeleted();

    if (!parent || !isView(parent)) {
      throw new Error('Parent is not a view');
    }

    queueMicrotask(() => {
      this.createRenderNode(parent);
    });
  }

  delete() {
    this.checkIfDeleted();

    if (this.node && isTextNode(this.node)) {
      this.node.destroy();
      this.deleted = true;
    }
  }

  needsLayoutUpdate() {
    return false; // this.onBeforeLayout;
  }

  layoutUpdate() {
    // noop
  }

  get parent() {
    return this._parent;
  }

  set parent(parent) {
    this._parent = parent;
    if (this.rendered && this.node) {
      this.node.parent = parent?.node?.parent ?? null;
    }
  }

  get style() {
    return this.props.style || {};
  }

  set style(style: TextStyle) {
    this.props.style = style;
  }
}

export const createText: ElementCreator<'ln-text'> = (_, props) => new Text(props);
