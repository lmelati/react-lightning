import type { FunctionComponent } from 'react'
import { TvView } from 'react-lightning';
import './App.css'
import React from 'react';

export const App: FunctionComponent = () => {
  const tvViewRef = React.useRef<TvView | null>(null);

  return (
    <ln-view ref={tvViewRef} width={1920} height={1080} color={0x000000ff}>
      <ln-view x={10} y={20} width={500} height={500} color={0xff00ffff}>
        <ln-text>Hello World!</ln-text>
      </ln-view>
    </ln-view>
  )
}

export default App
