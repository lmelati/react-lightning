import * as React from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants';
import { DOMReconciler } from './DOMReconciler';
import { type RendererSettings, startLightningRenderer } from './Lightning';
import type { ElementContainer } from './types';

import { RendererMain, SdfTrFontFace, TrFontFace, WebTrFontFace } from '@lightningjs/renderer';
import type { fontData } from './types/LightningFonts';

let lightningRenderer: RendererMain | undefined;
let LightningContext: React.Context<RendererMain>;
let LightningProvider: React.FunctionComponent;
let useLightning: () => RendererMain;

let FontManagerContext: React.Context<WebTrFontFace | SdfTrFontFace<any> | any>;
let useFontManager: () => void;
let FontManagerProvider: React.FunctionComponent<{
  fontData: fontData | undefined;
  children?: React.ReactNode;
}>;

async function init(rootId: string | HTMLElement, settings?: RendererSettings) {
  const rootElement = typeof rootId === 'string' ? document.getElementById(rootId)! : rootId;

  lightningRenderer = startLightningRenderer(settings, rootElement);
  const lightning = lightningRenderer;

  LightningContext = React.createContext(lightning);
  useLightning = () => React.useContext(LightningContext);

  // eslint-disable-next-line react/display-name
  LightningProvider = ({ children }: { children?: React.ReactNode }) => (
    <LightningContext.Provider value={lightning}>{children}</LightningContext.Provider>
  );

  FontManagerContext = React.createContext(undefined);
  useFontManager = () => React.useContext(FontManagerContext);
  // eslint-disable-next-line react/display-name
  FontManagerProvider = (props: { fontData: fontData | undefined; children?: React.ReactNode }) => {
    let fontManager!: TrFontFace;

    if (props.fontData) {
      if (!lightningRenderer?.stage) {
        throw new Error("Lightning renderer's stage not initialized.");
      }

      if (props.fontData.mode === 'webgl') {
        fontManager = new SdfTrFontFace(props.fontData.type, {
          stage: lightningRenderer?.stage,
          ...props.fontData.options,
        });
      } else {
        fontManager = new WebTrFontFace(props.fontData);
      }

      lightning.stage.fontManager.addFontFace(fontManager);
    }

    return <FontManagerContext.Provider value={fontManager}>{props.children}</FontManagerContext.Provider>;
  };
}

function render(element: React.ReactNode, callback?: () => void) {
  if (!lightningRenderer) {
    throw new Error('Lightning renderer not initialized. Call `init` before calling `render`.');
  }

  const rootNode: ElementContainer<'ln-view'> = {
    type: 'ln-view',
    props: {
      width: lightningRenderer.root.width,
      height: lightningRenderer.root.height,
    },
    rendered: false,
    children: [],
    node: null,
    render: () => {
      // Insert the root node into the lightning renderer
      rootNode.node = lightningRenderer?.createNode({
        parent: lightningRenderer.root,
        ...rootNode.props,
      });
    },
  };

  // Render the root node
  rootNode.render(rootNode);

  const container = DOMReconciler.createContainer(rootNode, ConcurrentRoot, null, false, null, '', console.error, null);

  DOMReconciler.updateContainer(element, container, null, callback);
}

export { LightningProvider, useLightning, useFontManager, FontManagerProvider, init, render };
