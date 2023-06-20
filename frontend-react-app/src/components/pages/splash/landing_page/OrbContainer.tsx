import { Grid } from '@mui/material';
import { Stage } from '@pixi/react';
import { useWindowWidth } from '../../../hooks/useWindowWidth';
import useOrbs from './hooks/useOrbs';
const OrbContainer = () => {
  const windowWidth = useWindowWidth();
  const height = window.innerHeight - 0.15 * window.innerHeight;
  const width = windowWidth - 0.011 * windowWidth;
  const orbs = useOrbs();

  return (
    <Grid container item>
      <Stage
        options={{
          autoDensity: true,
          backgroundAlpha: 0,
        }}
        width={width}
        height={height}
      >
        {orbs.map((orb) => {
          return orb;
        })}
      </Stage>
    </Grid>
  );
};
export default OrbContainer;
