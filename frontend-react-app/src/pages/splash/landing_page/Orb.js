import { forwardRef, useCallback, useRef, useState } from 'react';
import { Graphics } from '@pixi/react';
import { useTick } from '@pixi/react';
import getOrbBounds from './helpers/getOrbBounds';
import randomNum from './helpers/randomNum';
import getOrbPosition from './helpers/getOrbPosition';
import incrementOrbData from './helpers/incrementOrbData';
import updateOrb from './helpers/updateOrb';
const Orb = forwardRef((props, ref) => {
  const orbRef = useRef();
  const bounds = getOrbBounds();
  const [orbData, setOrbData] = useState({
    xPosition: getOrbPosition('x', bounds),
    yPosition: getOrbPosition('y', bounds),
    xOffSet: randomNum(0, 1000),
    yOffSet: randomNum(0, 1000),
    scale: 1,
  });
  const inc = 0.08;
  const draw = useCallback(
    (g) => {
      const radius = (() => {
        if (props.smallerScreen) {
          return randomNum(window.innerWidth / 7, window.innerWidth / 5);
        } else {
          return randomNum(window.innerHeight / 11, window.innerHeight / 8);
        }
      })();

      g.scale.set(1);

      // Clear anything currently drawn to graphics
      g.clear();

      // Tell graphics to fill any shapes drawn after this with the orb's fill color
      g.beginFill(props.fill);
      // Draw a circle at { 0, 0 } with it's size set by this.radius
      g.drawCircle(
        props.smallerScreen
          ? 0
          : randomNum(2 * (window.innerWidth / 4), 3 * (window.innerWidth / 4)),
        props.smallerScreen
          ? window.innerHeight * 0.45
          : window.innerHeight * 0.55,
        radius
      );
      // Let graphics know we won't be filling in any more shapes
      g.endFill();
    },
    [props]
  );
  useTick((delta) => {
    const yDelta = 0.5;
    const xDelta = 0.5;
    const scaleDelta = 0.001;
    const updatedValues = (() => {
      // If the orb has moved to it's destination, update the destination
      if (
        Math.abs(orbRef.current.position.x - orbData.xPosition) <= xDelta &&
        Math.abs(orbRef.current.position.y - orbData.yPosition) <= yDelta &&
        Math.abs(orbRef.current.scale.x - orbData.scale) <= scaleDelta
      ) {
        const updatedValues = updateOrb(
          orbData.xOffSet,
          orbData.yOffSet,
          bounds,
          inc
        );
        setOrbData(updatedValues);

        return updatedValues;
      } else {
        return orbData;
      }
    })();
    const newCoordinates = incrementOrbData(
      updatedValues.xPosition,
      orbRef.current.x,
      updatedValues.yPosition,
      orbRef.current.y,
      updatedValues.scale,
      orbRef.current.scale.x,
      xDelta,
      yDelta,
      scaleDelta
    );

    orbRef.current.x = newCoordinates.xPosition;
    orbRef.current.y = newCoordinates.yPosition;
    orbRef.current.scale.x = newCoordinates.scale;
    orbRef.current.scale.y = newCoordinates.scale;
  });
  return <Graphics draw={draw} ref={orbRef} />;
});
export default Orb;
