var Node = require("./node");
var $ = require("./$");

module.exports = class BLOCK extends Node {
  constructor() {
    super();
    this.statements = [];
  }

  run() {
    let list = this.statements;
    this.statements = [];
    return list;
  }

  stage(instruction) {
    if (
      instruction.scope.block.type === undefined &&
      instruction.statement.type === "CLASS"
    ) {
      throw new SyntaxError(
        "Cannot define class declaration in non-class block"
      );
    }

    if (
      instruction.run &&
      !(instruction.statement instanceof $) &&
      instruction.statement.type !== "CLASS"
    ) {
      let statement = instruction.statement;
      let block = statement.block;

      if (block && statement.id) {
        block.statements = block.statements.filter(s => s.id !== statement.id);
      }

      this.statements.push(instruction.statement);
    }
  }
};
