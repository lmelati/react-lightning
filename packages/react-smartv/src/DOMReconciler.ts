import reconciler, { type HostConfig } from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';

import {
  createNode,
  type NodeElementContainer,
  type NodeElement,
  type NodeProps,
  type NodeType,
  isContainerElement,
} from './types/NodeType';

type ContainerContext = {
  node: NodeElement<any>;
};

const hostConfig: HostConfig<
  NodeType, // Type
  NodeProps<any>, // Props
  NodeElementContainer<any>, // Container
  NodeElement<any>, // Instance
  NodeElement<'tv-text'>, // TextInstance
  any, // SuspenceInstance
  any, // HydratableInstance
  any, // PublicInstance
  ContainerContext, // HostContext
  any, // UpdatePayload
  NodeElement<any>[], // _ChildSet
  any, // TimeoutHandle
  any // NoTimout
> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  now: Date.now,
  supportsMutation: false,
  supportsHydration: false,
  supportsPersistence: true,

  createContainerChildSet(): NodeElement<any>[] {
    return [];
  },

  /**
   * Attaches new children to the set returned by createContainerChildSet
   * @param childSet
   * @param child
   */
  appendChildToContainerChildSet(childSet: NodeElement<any>[], child: NodeElement<any>) {
    childSet.push(child);
  },
  replaceContainerChildren(container: NodeElementContainer<any>, newChildren: NodeElement<any>[]) {
    // container.children.forEach((child) => child.delete())
    container.children = newChildren;
  },

  /**
   * This function lets you share some context with the other functions in this HostConfig.
   *
   * This method lets you return the initial host context from the root of the tree. See `getChildHostContext` for the explanation of host context.
   *
   * If you don't intend to use host context, you can return `null`.
   *
   * This method happens **in the render phase**. Do not mutate the tree from it.
   *
   * @param rootContainerInstance is basically the root dom node you specify while calling render. This is most commonly
   * <div id="root"></div>
   * @return A context object that you wish to pass to immediate child.
   */
  getRootHostContext(rootContainerInstance): ContainerContext {
    return { node: rootContainerInstance };
  },

  /**
   * This function provides a way to access context from the parent and also a way to pass some context to the immediate
   * children of the current node. Context is basically a regular object containing some information.
   *
   * Host context lets you track some information about where you are in the tree so that it's available inside `createInstance` as the `hostContext` parameter. For example, the DOM renderer uses it to track whether it's inside an HTML or an SVG tree, because `createInstance` implementation needs to be different for them.
   *
   * If the node of this `type` does not influence the context you want to pass down, you can return `parentHostContext`. Alternatively, you can return any custom object representing the information you want to pass down.
   *
   * If you don't want to do anything here, return `parentHostContext`.
   *
   * This method happens **in the render phase**. Do not mutate the tree from it.
   *
   * @param parentHostContext Context from parent. Example: This will contain rootContext for the immediate child of
   * roothost.
   * @param type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
   * @param rootContainerInstance rootInstance is basically the root dom node you specify while calling render. This is
   * most commonly <div id="root"></div>
   * @return A context object that you wish to pass to immediate child.
   */
  getChildHostContext(parentHostContext): ContainerContext {
    return parentHostContext;
  },

  createTextInstance(text): NodeElement<'tv-text'> {
    throw new Error(`The text '${text}' must be wrapped in a tv-text element.`);
  },

  shouldSetTextContent: (type): boolean => {
    return type === 'tv-text';
  },

  // Create the DOMElement, but attributes are set in `finalizeInitialChildren`
  createInstance(type, props) {
    return createNode(type, props);
  },

  appendInitialChild: (parentInstance, child) => {
    if (isContainerElement(parentInstance)) {
      parentInstance.children.push(child);
    } else {
      throw new Error('Bug? Trying to append a child to a parent that is not a container.');
    }
  },

  finalizeInitialChildren: (): boolean => {
    return false;
  },

  finalizeContainerChildren() {},

  prepareForCommit() {
    return null;
  },

  resetAfterCommit(containerInfo) {
    // TODO instead of re-rendering everything, only rerender dirty nodes?
    containerInfo.children.forEach((child) => child.render(containerInfo));
    containerInfo.props.renderCallback?.();
  },

  getPublicInstance(instance: NodeElement<any> | NodeElement<'tv-text'>) {
    return instance;
  },

  prepareUpdate() {
    // TODO check & return if we can need to create an entire new object or we can reuse the underlying skobject and use it as the payload in cloneInstance.
  },

  cloneInstance(
    instance: NodeElement<any>,
    _updatePayload: any,
    type: NodeType,
    _oldProps: NodeProps<any>,
    newProps: NodeProps<any>,
    _internalInstanceHandle: any,
    keepChildren: boolean
  ): NodeElement<any> {
    const ckElement = createNode(type, newProps);
    if (keepChildren && isContainerElement(ckElement) && isContainerElement(instance)) {
      ckElement.children = instance.children;
    }
    return ckElement;
  },

  getCurrentEventPriority: () => DefaultEventPriority,
};

const DOMReconciler = reconciler(hostConfig);

DOMReconciler.injectIntoDevTools({
  bundleType: 1, // __DEV__ ? 1 : 0
  version: '0.1.0',
  rendererPackageName: 'react-smartv',
});

export { DOMReconciler };
