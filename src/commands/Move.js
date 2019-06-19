import Command from './Command.js'

export default class Move extends Command {
  constructor(id, offset) {
    super();
    this.id = id;
    this.offset = {...offset};
  }

  do(elementsById) {
    elementsById[this.id].move(this.offset);
  }
}