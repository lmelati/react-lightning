import type { INode } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { Element, ElementContainer, ElementCreator, ElementProps, ObjectTyping, ViewStyle } from '../types';
import { type ReactNode } from 'react';
import { isNode } from '../utils';
import { toLightningNode } from '../LightningElementMapping';
import { toFlexbox } from '../LightningElementAdapter';

let queueLayout: boolean = true;
const layoutQueue: Set<ElementContainer<any>> = new Set();

export interface ViewProps extends ElementProps<View> {
  style?: ViewStyle | undefined;
  children?: ReactNode;
}

type TvViewChild = Element<'ln-view'> | Element<'ln-text'>;

export class View implements Element<'ln-view'> {
  readonly type = 'ln-view' as const;

  private _parent: ElementContainer<any> | undefined;

  props: ObjectTyping['ln-view']['props'];
  node: INode<any> | undefined;
  children: TvViewChild[] = [];

  rendered = false;
  deleted = false;

  constructor(props: ObjectTyping['ln-view']['props']) {
    this.props = props;
  }

  private checkIfDeleted(): void {
    if (this.deleted) {
      throw new Error('View element deleted.');
    }
  }

  private addToLayoutQueueIfNeeded(parent: ElementContainer<any>): void {
    if (parent.needsLayoutUpdate() && !layoutQueue.has(parent)) {
      layoutQueue.add(parent);

      if (queueLayout) {
        this.processLayoutQueue();
      }
    }
  }

  private processLayoutQueue(): void {
    queueLayout = false;
    queueMicrotask(() => {
      queueLayout = true;
      const queue = [...layoutQueue];
      layoutQueue.clear();
      for (let i = queue.length - 1; i >= 0; i--) {
        queue[i]!.layoutUpdate();
      }
    });
  }

  private createRenderNode(parent: ElementContainer<any>): void {
    const lightningNodeBuilder = toLightningNode(this.style, parent);
    this.node = renderer.createNode({
      parent: parent.node,
      ...lightningNodeBuilder,
    });
    this.rendered = true;
  }

  private renderChildren(): void {
    this.children.forEach((child) => child.render(this));
  }

  render(parent: ElementContainer<any>): void {
    this.checkIfDeleted();
    this.addToLayoutQueueIfNeeded(parent);

    queueMicrotask(() => {
      this.createRenderNode(parent);
      this.renderChildren();
    });
  }

  delete() {
    this.checkIfDeleted();

    if (this.node && isNode(this.node)) {
      this.node.destroy();
      this.deleted = true;
    }
  }

  needsLayoutUpdate() {
    return this.style.display === 'flex'; // || this.onBeforeLayout;
  }

  layoutUpdate() {
    if (this.hasChildren) {
      if (this.style.display === 'flex') {
        if (toFlexbox(this)) {
          this.parent?.layoutUpdate();
        }
      }
    }
  }

  get hasChildren() {
    return this.children.length > 0;
  }

  get parent() {
    return this._parent;
  }

  set parent(parent) {
    this._parent = parent;
    if (this.rendered && this.node) {
      this.node.parent = parent?.node?.parent || null;
    }
  }

  get style() {
    return this.props.style || {};
  }

  set style(style: ViewStyle) {
    this.props.style = style;
  }
}

export const createView: ElementCreator<'ln-view'> = (_, props): ElementContainer<'ln-view'> => new View(props);

export function isView(element: Element<any>): element is View {
  return element.type === 'ln-view';
}
