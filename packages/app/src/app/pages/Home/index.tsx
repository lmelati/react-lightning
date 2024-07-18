import { type FunctionComponent } from 'react';

import { Featured } from '../../components/Featured';

export const Home: FunctionComponent = () => {
  return (
    <ln-view width={1920} height={1080}>
      <Featured />
    </ln-view>
  );
};
