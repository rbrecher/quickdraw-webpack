import Command from './Command.js'

export default class Delete extends Command {
  constructor(id) {
    super();
    this.id = id;
  }

  do(elementsById) {
    delete elementsById[this.id];
  }
}