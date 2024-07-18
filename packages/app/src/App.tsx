import type { FunctionComponent } from 'react';
import { View } from 'react-lightning';
import React from 'react';

export const App: FunctionComponent = () => {
  const viewRef = React.useRef<View | null>(null);

  return (
    <ln-view ref={viewRef} width={1920} height={1080} color="#FF5533">
      <ln-text color="#FFFFFF" fontSize={50} fontFamily="NotoSans">
        Hello World
      </ln-text>
    </ln-view>
  );
};

export default App;
