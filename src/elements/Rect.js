import Element from './Element.js'

import { rectContainsPoint } from '../utils/geometry.js';

export default class Rect extends Element {
  draw(context) {
    context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    context.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }

  isHit(point) {
    return rectContainsPoint(point, this.rect);
  }
}