/* eslint-disable prettier/prettier */
import reconciler, { type HostConfig } from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';

import {
  isContainerElement,
  type ElementType,
  type Element,
  type ElementProps,
  type ElementContainer,
  createElement,
} from './types';

type ContainerContext = {
  element: Element<any>;
};

const hostConfig: HostConfig<
  ElementType, // Type
  ElementProps<any>, // Props
  ElementContainer<any>, // Container
  Element<any>, // Instance
  Element<'ln-text'>, // TextInstance
  Element<any>, // SuspenceInstance
  Element<any>, // HydratableInstance
  void, // PublicInstance
  ContainerContext, // HostContext
  any, // UpdatePayload
  Element<any>[], // _ChildSet
  number | undefined, // TimeoutHandle
  any // NoTimout
> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  now: Date.now,
  supportsMutation: false,
  isPrimaryRenderer: false,
  supportsHydration: false,
  supportsPersistence: true,
  noTimeout: -1,

  createContainerChildSet(): Element<any>[] {
    return [];
  },

  detachDeletedInstance(instance) {
    instance.delete();
  },

  /**
   * Attaches new children to the set returned by createContainerChildSet
   * @param childSet
   * @param child
   */
  appendChildToContainerChildSet(childSet: Element<any>[], child: Element<any>) {
    childSet.push(child);
  },
  replaceContainerChildren(container: ElementContainer<any>, newChildren: Element<any>[]) {
    container.children.forEach((child) => child.delete());
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
    return { element: rootContainerInstance };
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

  createTextInstance(text): Element<'ln-text'> {
    throw new Error(`The text '${text}' must be wrapped in a ln-text element.`);
  },

  shouldSetTextContent: (type): boolean => {
    return type === 'ln-text';
  },

  // Create the DOMElement, but attributes are set in `finalizeInitialChildren`
  createInstance(type, props) {
    return createElement(type, props);
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

  getPublicInstance(instance: Element<any> | Element<'ln-text'>) {
    return instance;
  },

  prepareUpdate() {
    // instance: Element<any>,
    // type: ElementType,
    // oldProps: ElementProps<any>,
    // newProps: ElementProps<any>,
    // containerInfo,
    // parentHostContext
    // TODO check & return if we can need to create an entire new object or we can reuse the underlying object and use it as the payload in cloneInstance.
    // console.log('prepareUpdate');
    // console.log('instance', instance);
    // console.log('type', type);
    // console.log('oldProps', oldProps);
    // console.log('newProps', newProps);
    // console.log('containerInfo', containerInfo);
    // console.log('parentHostContext', parentHostContext);
  },

  cloneInstance(
    instance: Element<any>,
    _updatePayload: any,
    type: ElementType,
    _oldProps: ElementProps<any>,
    newProps: ElementProps<any>,
    _internalInstanceHandle: any,
    keepChildren: boolean
  ): Element<any> {
    const ckElement = createElement(type, newProps);
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
  rendererPackageName: 'react-lightning',
});

export { DOMReconciler };
