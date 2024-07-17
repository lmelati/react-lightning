import * as React from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants';
import { DOMReconciler } from './DOMReconciler';
import { type RendererSettings, startLightningRenderer } from './Lightning';
import type { NodeElementContainer } from './types/NodeType';

import { RendererMain, WebTrFontFace } from '@lightningjs/renderer';

let lightningRenderer: RendererMain | undefined;
let LightningContext: React.Context<RendererMain>;
let LightningProvider: React.FunctionComponent;
let useLightning: () => RendererMain;

let FontManagerContext: React.Context<WebTrFontFace>;
let useFontManager: () => void;
let FontManagerProvider: React.FunctionComponent<{
  fontData: ArrayBuffer[] | undefined;
  children?: React.ReactNode;
}>;

async function init(rootId: string | HTMLElement, settings?: RendererSettings) {
  const rootElement = typeof rootId === 'string' ? document.getElementById(rootId)! : rootId;

  lightningRenderer = startLightningRenderer(settings, rootElement);
  const robotoFontUrl = 'https://storage.googleapis.com/skia-cdn/misc/Roboto-Regular.ttf';
  const lightning = lightningRenderer;

  LightningContext = React.createContext(lightning);
  useLightning = () => React.useContext(LightningContext);

  // eslint-disable-next-line react/display-name
  LightningProvider = ({ children }: { children?: React.ReactNode }) => (
    <LightningContext.Provider value={lightning}>{children}</LightningContext.Provider>
  );

  const defaultFontManager = new WebTrFontFace({
    fontFamily: 'Roboto',
    fontUrl: robotoFontUrl,
    descriptors: {},
  });

  lightning.stage.fontManager.addFontFace(defaultFontManager);

  console.log('defaultFontManager', defaultFontManager);

  FontManagerContext = React.createContext(defaultFontManager);
  useFontManager = () => React.useContext(FontManagerContext);
  // eslint-disable-next-line react/display-name
  FontManagerProvider = (props: { fontData?: ArrayBuffer[]; children?: React.ReactNode }) => {
    return <FontManagerContext.Provider value={defaultFontManager}>{props.children}</FontManagerContext.Provider>;
    // if (props.fontData) {
    //   const fontMgrFromData = ck.FontMgr.FromData(...props.fontData);
    //   if (fontMgrFromData === null) {
    //     throw new Error('Failed to create font manager from font data.');
    //   }

    //   return (
    //     <FontManagerContext.Provider value={fontMgrFromData}>
    //       {props.children}
    //     </FontManagerContext.Provider>
    //   );
    // } else {

    // }
  };
}

function render(element: React.ReactNode, callback?: () => void) {
  if (!lightningRenderer) {
    throw new Error('Lightning renderer not initialized. Call `init` before calling `render`.');
  }

  const rootNode: NodeElementContainer<'tv-view'> = {
    type: 'tv-view',
    props: {
      width: lightningRenderer.root.width,
      height: lightningRenderer.root.height,
      color: 0xff0000ff,
    },
    rendered: false,
    children: [],
    node: null,
    render: () => {
      console.log('CAINDO AQUI???');
    },
  };

  const container = DOMReconciler.createContainer(rootNode, ConcurrentRoot, null, false, null, '', console.error, null);

  DOMReconciler.updateContainer(element, container, null, callback);
}

export { LightningProvider, useLightning, useFontManager, FontManagerProvider, init, render };
