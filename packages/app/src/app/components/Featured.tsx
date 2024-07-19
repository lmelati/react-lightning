import { useRef, type FunctionComponent } from 'react';
import type { View } from 'react-lightning';

import HeroMask from '../../assets/images/hero-mask.png';

export const Featured: FunctionComponent = () => {
  const heroMaskRef = useRef<View>(null);

  return (
    <ln-view width={1920} height={1080} zIndex={-5}>
      <ln-view ref={heroMaskRef} src={HeroMask} />
    </ln-view>
  );
};
