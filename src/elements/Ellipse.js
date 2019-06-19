import Element from './Element.js'

import { ellipseContainsPoint } from '../utils/geometry.js';

export default class Ellipse extends Element {
  draw(context) {
    context.beginPath();
    context.ellipse(
      this.rect.x + this.rect.width * 0.5, 
      this.rect.y + this.rect.height * 0.5, 
      Math.abs(this.rect.width) * 0.5,
      Math.abs(this.rect.height) * 0.5, 
      0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  isHit(point) {
    return ellipseContainsPoint(point, this.rect);
  }
}