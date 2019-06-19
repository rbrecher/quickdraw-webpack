export const distanceToSegmentSquared = (p, rect) => {
  const v = {x: rect.x, y: rect.y};
  const w = {x: rect.x + rect.width, y: rect.y + rect.height};
  const l2 = distanceSquared(v, w);
  if (l2 === 0) {
    return distanceSquared(p, v);
  }
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return distanceSquared(p, {x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y)});
}

export const distanceSquared = (v, w) => {
  return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
}

export const rectContainsPoint = (p, rect) => {
  const minX = Math.min(rect.x, rect.x + rect.width);
  const maxX = Math.max(rect.x, rect.x + rect.width);
  const minY = Math.min(rect.y, rect.y + rect.height);
  const maxY = Math.max(rect.y, rect.y + rect.height);
  return (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY);
}

export const ellipseContainsPoint = (p, rect) => {
  const center = {x: rect.x + rect.width * 0.5, y: rect.y + rect.height * 0.5};
  const radius = {x: Math.abs(rect.width) * 0.5, y: Math.abs(rect.height) * 0.5};
  return Math.pow(p.x - center.x, 2) / Math.pow(radius.x, 2) + Math.pow(p.y - center.y, 2) / Math.pow(radius.y, 2) <= 1;
}
