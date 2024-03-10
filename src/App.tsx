import { memo } from 'react';
import type { FC } from 'react';

import classes from './App.module.scss';
import resets from './components/_resets.module.scss';
import { Profile_page_design_variant1 } from './components/Profile_page_design_variant1/Profile_page_design_variant1.js';

interface Props {
  className?: string;
}
export const App: FC<Props> = memo(function App(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <Profile_page_design_variant1 />
    </div>
  );
});
