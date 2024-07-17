import type { INode, ITextNodeProps } from '@lightningjs/renderer';
import { renderer } from '../Lightning';
import type { NodeCreator, NodeElement, NodeElementContainer, NodeProps, ObjectTyping } from '../types/NodeType';
import { isTvView } from './TvView';

export interface TvTextProps extends NodeProps<Partial<ITextNodeProps>> {
  children: string;
}

export class TvText implements NodeElement<'tv-text'> {
  readonly type = 'tv-text' as const;
  readonly props: ObjectTyping['tv-text']['props'];

  rendered: boolean;
  node: INode<any> | null | undefined;

  constructor(props: ObjectTyping['tv-text']['props']) {
    this.props = props;
    this.rendered = false;
  }

  render(parent?: NodeElementContainer<any>): void {
    if (!parent || !isTvView(parent)) {
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

export const createTvText: NodeCreator<'tv-text'> = (_, props) => new TvText(props);
