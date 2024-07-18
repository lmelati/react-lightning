import { type CustomFonts, init, render, type RendererSettings } from 'react-lightning';
import App from './App';
import './index.css';

const basePath = import.meta.env.BASE_URL;

const defaultResolution = window.innerHeight;

const appWidth = 1920;
const appHeight = 1080;
const logicalPixelRatio = defaultResolution / appHeight;

export const renderMode = 'webgl';

const config: RendererSettings = {
  appWidth,
  appHeight,
  enableInspector: true,
  renderMode,
  deviceLogicalPixelRatio: logicalPixelRatio,
};

const customNotoSansFont: CustomFonts = {
  mode: renderMode,
  type: 'ssdf',
  options: {
    fontFamily: 'NotoSans',
    descriptors: {},
    atlasUrl: basePath + 'fonts/NotoSans-Regular.ssdf.png',
    atlasDataUrl: basePath + 'fonts/NotoSans-Regular.ssdf.json',
    metrics: {
      ascender: 1000,
      descender: -200,
      lineGap: 0,
      unitsPerEm: 1000,
    },
  },
};

// eslint-disable-next-line react/react-in-jsx-scope
init(document.getElementById('app')!, config, customNotoSansFont).then(() => render(<App />));
