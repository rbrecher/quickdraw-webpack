import Command from './Command.js'

import Line from '../elements/Line.js'
import Rect from '../elements/Rect.js'
import Ellipse from '../elements/Ellipse.js'

export default class Create extends Command {
  constructor(id, shape, rect) {
    super();
    this.id = id;
    this.shape = shape;
    this.rect = {...rect};
  }

  do(elementsById) {
    switch (this.shape) {
      case "line":
        elementsById[this.id] = new Line(this.rect);
        break;
      case "rect":
        elementsById[this.id] = new Rect(this.rect);
        break;
      case "ellipse":
        elementsById[this.id] = new Ellipse(this.rect);
        break;
    }
    
  }
}