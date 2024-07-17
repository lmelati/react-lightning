import type { FunctionComponent } from 'react'
import { TvView } from 'react-smartv';
import './App.css'
import React from 'react';

export const App: FunctionComponent = () => {
  const tvViewRef = React.useRef<TvView | null>(null);

  return (
    <tv-view ref={tvViewRef} width={1920} height={1080} color={0x000000ff}>
      <tv-view x={10} y={20} width={500} height={500} color={0xff00ffff}>
        <tv-text>Hello World!</tv-text>
      </tv-view>
    </tv-view>
  )
}

export default App
