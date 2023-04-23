export default function getOrbBounds() {
  // how far from the { x, y } origin can each orb move
  const maxDist =
    window.innerWidth < 1000 ? window.innerWidth / 7 : window.innerWidth / 5;
  // the { x, y } origin for each orb (the bottom right of the screen)
  const originX = window.innerWidth < 1000 ? 100 : window.innerWidth / 1.25;
  const originY = window.innerHeight * 0.4;
  // allow each orb to move x distance away from it's { x, y } origin
  return {
    x: {
      min: originX - maxDist,
      max: originX + maxDist,
    },
    y: {
      min: originY - maxDist,
      max: originY + maxDist,
    },
  };
}
