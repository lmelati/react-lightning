import { init, render, type RendererSettings } from 'react-smartv';
import App from './App';
import './index.css';

const defaultResolution = window.innerHeight

const appWidth = 1920
const appHeight = 1080
const logicalPixelRatio = defaultResolution / appHeight;

const config: RendererSettings = {
  appWidth,
  appHeight,
  enableInspector: true,
  deviceLogicalPixelRatio: logicalPixelRatio,
}

init(document.getElementById('app')!, config).then(() => render(<App />))
