import { type FontMetrics, type TrFontFaceDescriptors } from '@lightningjs/renderer';

export type fontData =
  | {
      mode: 'webgl';
      type: 'ssdf' | 'msdf';
      options: {
        fontFamily: string;
        descriptors: Partial<TrFontFaceDescriptors>;
        atlasUrl: string;
        atlasDataUrl: string;
        metrics?: FontMetrics;
      };
    }
  | { mode: 'canvas'; fontFamily: string; fontUrl: string; descriptors: Partial<TrFontFaceDescriptors> };
