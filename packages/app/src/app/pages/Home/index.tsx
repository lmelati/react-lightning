import { type FunctionComponent } from 'react';

import { Featured } from '../../components/Featured';
import { usePageBuilder } from '../../../hooks/usePageBuilder';
import { ListRow } from '../../components/ListRow';

const marginX = 150;

export const HomePage: FunctionComponent = () => {
  const [sections, isLoading] = usePageBuilder();
  // const [columnY, setcolumnY] = useState(0);

  if (isLoading) {
    return (
      <ln-view color="#000" width={1920} height={1080}>
        <ln-text color="#FFF">Loading...</ln-text>
      </ln-view>
    );
  }

  return (
    <ln-view width={1920} height={1080}>
      <Featured />

      <ln-view clipping width={1920} height={800} y={560} x={0} zIndex={2}>
        <ln-view
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          width={1920 - 2 * marginX}
          gap={64}
          x={marginX + 20}
          y={48}
          zIndex={2}
        >
          {sections.map((section, index) => (
            <ListRow key={index} title={section.title} items={section.data} />
          ))}
        </ln-view>
      </ln-view>
    </ln-view>
  );
};
