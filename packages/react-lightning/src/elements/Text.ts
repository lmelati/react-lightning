import type { INode, ITextNodeProps } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { Element, ElementContainer, ElementCreator, ElementProps, ObjectTyping } from '../types';
import { isView } from './View';

export interface TextProps extends ElementProps<Partial<ITextNodeProps>> {
  children: string;
}

export class Text implements Element<'ln-text'> {
  readonly type = 'ln-text' as const;
  readonly props: ObjectTyping['ln-text']['props'];

  rendered: boolean;
  node: INode<any> | null | undefined;

  constructor(props: ObjectTyping['ln-text']['props']) {
    this.props = props;
    this.rendered = false;
  }

  render(parent?: ElementContainer<any>): void {
    if (!parent || !isView(parent)) {
      console.warn('Parent is not a TvView');
      return;
    }

    if (!parent.rendered) {
      console.warn('Parent not rendered yet:', this);
      return;
    }

    if (this.rendered) {
      console.warn('Text already rendered:', this);
      return;
    }

    this.node = renderer.createTextNode({
      color: 0xffffffff,
      text: this.props.children,
      zIndex: 99999,
      parent: parent.node,
      fontSize: 50,
    });

    this.rendered = true;
  }
}

export const createText: ElementCreator<'ln-text'> = (_, props) => new Text(props);
