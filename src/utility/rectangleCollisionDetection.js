export function rectangleCollisionDetection(aL, aT, aR, aB, bL, bT, bR, bB) {
  return aL < bR && aT < bB && aR > bL && aB > bT;
}
