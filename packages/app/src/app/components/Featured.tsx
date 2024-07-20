import { useRef, type FunctionComponent } from 'react';
import type { View } from 'react-lightning';

import HeroMask from '../../assets/images/hero-mask.png';

export const Featured: FunctionComponent = () => {
  const heroMaskRef = useRef<View>(null);

  return (
    <ln-view width={1920} height={1080} zIndex={-5}>
      <ln-view alpha={1} color="#FFF" src="https://image.tmdb.org/t/p/original/7cqKGQMnNabzOpi7qaIgZvQ7NGV.jpg" />
      <ln-view ref={heroMaskRef} color="#000" src={HeroMask} />
    </ln-view>
  );
};
