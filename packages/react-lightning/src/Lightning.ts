import { RendererMain, type RendererMainSettings } from '@lightningjs/renderer';

export let renderer: RendererMain;
export let createShader: RendererMain['createShader'];
export type RendererSettings = RendererMainSettings;

export const startLightningRenderer = (settings: RendererMainSettings = {}, rootElement: HTMLElement): RendererMain => {
  renderer = new RendererMain(settings, rootElement);
  createShader = renderer.createShader.bind(renderer);
  return renderer;
};
