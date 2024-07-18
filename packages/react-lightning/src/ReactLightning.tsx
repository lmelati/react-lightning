import * as React from 'react';
import { ConcurrentRoot } from 'react-reconciler/constants';
import { DOMReconciler } from './DOMReconciler';
import { type RendererSettings, startLightningRenderer } from './Lightning';
import type { ElementContainer } from './types';

import { RendererMain, SdfTrFontFace, TrFontFace, WebTrFontFace } from '@lightningjs/renderer';
import type { CustomFonts } from './types/LightningFonts';

let lightningRenderer: RendererMain | undefined;

async function init(rootId: string | HTMLElement, settings?: RendererSettings, customFonts?: CustomFonts) {
  const rootElement = typeof rootId === 'string' ? document.getElementById(rootId)! : rootId;

  lightningRenderer = startLightningRenderer(settings, rootElement);
  const lightning = lightningRenderer;
  let fontManager!: TrFontFace;

  if (customFonts) {
    if (!lightning?.stage) {
      throw new Error('Lightning stage not initialized.');
    }

    if (customFonts.mode === 'webgl') {
      fontManager = new SdfTrFontFace(customFonts.type, {
        stage: lightning.stage,
        ...customFonts.options,
      });
    } else {
      fontManager = new WebTrFontFace(customFonts);
    }

    lightning.stage.fontManager.addFontFace(fontManager);
  }
}

function render(element: React.ReactNode, callback?: () => void) {
  if (!lightningRenderer) {
    throw new Error('Lightning renderer not initialized. Call `init` before calling `render`.');
  }

  const rootNode: ElementContainer<'ln-view'> = {
    type: 'ln-view',
    props: {},
    children: [],
    node: lightningRenderer.root,
    render: () => {
      rootNode.children.forEach((child) => child.render(rootNode));
    },
    delete: () => {
      rootNode.delete();
    },
  };

  const container = DOMReconciler.createContainer(rootNode, ConcurrentRoot, null, false, null, '', console.error, null);

  DOMReconciler.updateContainer(element, container, null, callback);
}

export { init, render };
