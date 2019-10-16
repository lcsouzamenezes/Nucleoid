var state = require("./state"); // eslint-disable-line no-unused-vars
var Node = require("./node");
var graph = require("./graph");
var Identifier = require("./identifier");

class PROPERTY extends Node {
  prepare() {
    let prefix = Identifier.serialize(this.object, true);
    this.id = prefix + "." + this.name;
  }

  run(scope) {
    let instance = eval("state." + Identifier.serialize(this.object, true));
    instance[this.name] = this.value.run(scope);
  }

  graph() {
    return this.value.graph().filter(token => {
      if (graph.node[token]) return true;
      else if (graph.node[token.split(".")[0]]) {
        graph.node[token] = new Node();
        return true;
      }
    });
  }
}

PROPERTY.prototype.type = "REGULAR";
module.exports = PROPERTY;
