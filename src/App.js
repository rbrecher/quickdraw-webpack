import Create from './commands/Create.js'
import Move from './commands/Move.js'
import Delete from './commands/Delete.js'

export default class App {

  constructor() {

    // tools
    this.currentTool = '';
    this.dragStart = null;
    this.dragTarget = null;

    // command stack
    this.transientCommand = null;
    this.commands = [];
    this.undos = [];
    this.nextId = 1;

    // canvas
    this.context = null;
    this.elementsById = null;
  }

  init() {

    // add listeners to palette
    const nodes = document.querySelectorAll('.palette-item');
    nodes.forEach(node => {
    switch (node.id) {
        case 'undo':
          node.addEventListener('click', e => this.handleUndoClick(e));
          break;
        case 'redo':
          node.addEventListener('click', e => this.handleRedoClick(e));
          break;
        case 'new':
          node.addEventListener('click', e => this.handleNewClick(e));
          break;
        default:
          node.addEventListener('click', e => this.handleToolClick(e));
          break;
      }
    });

    // add listeners to canvas
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', e => this.handleCanvasMouseDown(e));
    canvas.addEventListener('mousemove', e => this.handleCanvasMouseMove(e));
    canvas.addEventListener('mouseup', e => this.handleCanvasMouseUp(e));
    this.context = canvas.getContext('2d');

    // select line tool by default
    this.selectTool('line');

    // render canvas
    this.updateButtonsForCurrentState();
    this.renderCommandsToElements();
  }

  selectTool(tool) {
    if (this.currentTool === tool) {
      return;
    }
    if (this.currentTool != '') {
      document.getElementById(this.currentTool).className = 'palette-item'; 
    }
    document.getElementById(tool).className = 'palette-item highlight';
    this.currentTool = tool;
  }

  updateButtonsForCurrentState() {
    document.getElementById('undo').disabled = this.commands.length === 0;
    document.getElementById('redo').disabled = this.undos.length === 0;
  }

  addDeleteCommand(id, isTransient) {
    this.addCommand(new Delete(id), isTransient);
  }

  addMoveCommand(id, offset, isTransient) {
    this.addCommand(new Move(id, offset), isTransient);
  }

  addCreateCommand(tool, rect, isTransient) {
    this.addCommand(new Create(this.nextId, tool, rect), isTransient);
  }

  addCommand(command, isTransient) {
    if (isTransient) {
      this.transientCommand = command;
    } else {
      this.transientCommand = null;
      this.commands.push(command);
      this.undos = [];
      this.nextId++;
    }
    this.updateButtonsForCurrentState();
    this.renderCommandsToElements();
  }

  renderCommandsToElements() {

    // reset elements
    this.elementsById = {};

    // process command stack
    const allCommands = this.transientCommand != null ? [...this.commands, this.transientCommand] : this.commands;
    allCommands.forEach(command => command.do(this.elementsById));

    // render elements
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    for (let id in this.elementsById) {
      this.elementsById[id].draw(this.context);
    };
  }

  hitTest(p) {
    const keys = Object.keys(this.elementsById);
    for (let i = keys.length - 1; i >= 0; i--) {
      const id = keys[i];
      if (this.elementsById[id].isHit(p)) {
        return id;
      }
    }
    return null;
  }

  handleUndoClick(e) {
    if (this.commands.length) {
      this.undos.push(this.commands.pop());
      this.updateButtonsForCurrentState();
      this.renderCommandsToElements();
    }
  }

  handleRedoClick(e) {
    if (this.undos.length) {
      this.commands.push(this.undos.pop());
      this.updateButtonsForCurrentState();
      this.renderCommandsToElements();
    }
  }

  handleNewClick(e) {
    this.commands = [];
    this.undos = [];
    this.transient = null;
    this.updateButtonsForCurrentState();
    this.renderCommandsToElements();
  }

  handleToolClick(e) {
    this.selectTool(e.currentTarget.id);
  }

  handleCanvasMouseDown(e) {
    this.dragStart = {x: e.layerX, y: e.layerY};
    switch (this.currentTool) {
      case 'delete':
      case 'move':
        this.dragTarget = this.hitTest(this.dragStart);
        break;
    }
  }

  handleCanvasMouseMove(e) {
    switch (this.currentTool) {
      case 'move':
        if (this.dragStart != null && this.dragTarget != null) {
          this.addMoveCommand(this.dragTarget, {x: e.layerX - this.dragStart.x, y: e.layerY - this.dragStart.y}, true);  
        }
        break;
      case 'line':
      case 'rect':
      case 'ellipse':
        if (this.dragStart != null) {
          this.addCreateCommand(this.currentTool, {...this.dragStart, width: e.layerX - this.dragStart.x, height: e.layerY - this.dragStart.y}, true);  
        }
        break;
    }
  }

  handleCanvasMouseUp(e) {
    switch (this.currentTool) {
      case 'delete': {
        let target = this.hitTest({x: e.layerX, y: e.layerY});
        if (target === this.dragTarget) {
          this.addDeleteCommand(this.target);  
        }
        break;
      }
      case 'move':
        if (this.dragStart != null && this.dragTarget != null) {
          this.addMoveCommand(this.dragTarget, {x: e.layerX - this.dragStart.x, y: e.layerY - this.dragStart.y});  
        }
        break;
      case 'line':
      case 'rect':
      case 'ellipse':
        if (this.dragStart != null) {
          this.addCreateCommand(this.currentTool, {...this.dragStart, width: e.layerX - this.dragStart.x, height: e.layerY - this.dragStart.y});
        }
        break;
    }
    this.dragStart = null;
    this.dragTarget = null;
  }
}