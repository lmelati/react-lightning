<h1 align="center">
  <a href="https://reactnative.dev/">
    React Lightning
  </a>
</h1>

<p align="center">
  <strong>Learn once, write anywhere:</strong><br>
  React Renderer to build UI interfaces using <a href="https://lightningjs.io/">Lightning 3 Renderer</a>
</p>

### DISCLAIMER: In experimental stage

React Lightning is a react renderer to build UI interfaces using Lightningjs. It's mainly a renderer focused on creating things for Smart TV, Android TV, PS5 and low memory devices.

## 📖 Documentation

Coming Soon

## Demo App

Coming Soon

## 🚀 API Usage

#### Install it using your favorite package manager

```bash
# NPM
npm install react-lightning

# Yarn
yarn add react-lightning

# PNPM
pnpm add react-lightning
```

React Lightning Hello World example

```jsx
import { init, render } from 'react-lightning';

const rootElement = document.getElementById('app')

const appWidth = 1280
const appHeight = 720
const defaultResolution = window.innerHeight
const logicalPixelRatio = defaultResolution / appHeight;

const config = {
  appWidth,
  appHeight,
  deviceLogicalPixelRatio: logicalPixelRatio,
}

init(rootElement, config).then(() => render(() => {
  <ln-view width={500} height={500} color={0x0000ffff}>
    <ln-text>Hello World</tv-text>
  </ln-view>
}))

```
