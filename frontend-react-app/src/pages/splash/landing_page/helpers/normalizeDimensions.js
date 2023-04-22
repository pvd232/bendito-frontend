import mapValues from './mapValues';
export default function normalizeDimensions(
  xPosition = false,
  yPosition = false,
  bounds
) {
  if (xPosition) {
    return mapValues(xPosition, bounds['x'].min, bounds['x'].max, 0, 800);
  } else if (yPosition) {
    return mapValues(yPosition, bounds['y'].min, bounds['y'].max, 0, 600);
  }
}