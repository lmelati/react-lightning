import { type FunctionComponent } from 'react';

type ListRowProps = {
  title: string;
  items: any[];
};
export const ListRow: FunctionComponent<ListRowProps> = ({ title }) => {
  return (
    <ln-view color="#234" width={1620} height={300}>
      <ln-text color="#000">{title}</ln-text>
    </ln-view>
  );
};
