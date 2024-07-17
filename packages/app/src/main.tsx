import { init, render, type RendererSettings } from 'react-lightning';
import App from './App';
import './index.css';

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

init(document.getElementById('app')!, config).then(() => render(<App />));
