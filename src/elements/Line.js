import Element from './Element.js';

import { distanceToSegmentSquared } from '../utils/geometry.js';

export default class Line extends Element {
  draw(context) {
    context.beginPath();
    context.moveTo(this.rect.x, this.rect.y);
    context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height);
    context.stroke();
  }

  isHit(point) {
    return distanceToSegmentSquared(point, this.rect) < 4
  }
}