var graph = require("./graph");
var Node = require("./node");
var Token = require("./token");
var VARIABLE = require("./variable").VARIABLE;
var IF = require("./if").IF;
var $VAR = require("./variable");
var $ASSIGN = require("./assignment");
var $IF = require("./if");
var $EXP = require("./expression");
var crypto = require("crypto");

module.exports.extract = function(string) {
  let list = [];

  for (let offset = 0; offset < string.length; ) {
    let context = Token.next(string, offset);

    if (Token.next(string, context.offset).token == "=") {
      if (graph.node[context.token]) {
        context = $ASSIGN(string, offset);
      } else {
        context = $VAR(string, offset);
      }
    } else {
      if (context.token == "var") {
        context = $VAR(string, offset);
      } else if (context.token == "if") {
        context = $IF(string, offset);
      } else {
        context = $EXP(string, offset);
      }
    }

    offset = context.offset;
    list.push(context.statement);

    let statement = context.statement;

    switch (statement.constructor) {
      case VARIABLE: {
        let variable = statement.variable;
        graph.node[variable] = new Node();
        graph.node[variable].statement = statement;

        statement.dependencies.forEach(
          e => (graph.node[e].edge[variable] = graph.node[variable])
        );
        break;
      }

      case IF: {
        let shasum = crypto
          .createHash("sha1")
          .update("if(" + statement.expression + ")")
          .digest("hex");

        graph.node[shasum] = new Node();
        graph.node[shasum].statement = statement;
        statement.dependencies.forEach(
          e => (graph.node[e].edge[shasum] = graph.node[shasum])
        );
        break;
      }
    }
  }

  return list;
};
