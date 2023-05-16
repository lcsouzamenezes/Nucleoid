const graph = require("../graph");
const uuid = require("uuid").v4;
const transaction = require("../transaction");
const serialize = require("../lib/serialize");
const revive = require("../lib/revive");

let sequence = 0;

class Node {
  constructor() {
    this.instanceof = this.constructor.name;
    this.next = {};
    this.previous = {};
    this.id = uuid();
    this.sequence = sequence++;
  }

  before() {}
  run() {}
  beforeGraph() {}
  graph() {}

  static register(node) {
    const exec = serialize(node, "graph");
    transaction.push(`Node.register(${exec})`);

    revive(node);

    const { key, id } = node;

    if (key) {
      transaction.assignGraph(graph, key, node);
    }

    transaction.assignGraph(graph, id, node);
  }

  static replace(sourceKey, targetNode) {
    const exec = serialize(targetNode, "graph");
    transaction.push(`Node.replace('${sourceKey}',${exec})`);

    revive(targetNode);

    transaction.assignGraph(targetNode.block, graph[sourceKey].block);

    for (let node in graph[sourceKey].next) {
      transaction.assignGraph(
        targetNode.next,
        node,
        graph[sourceKey].next[node]
      );

      transaction.assignGraph(graph[sourceKey].next, node, undefined);
    }

    for (let node in graph[sourceKey].previous) {
      transaction.assignGraph(graph[node].next, sourceKey, undefined);
    }

    const { key, id } = targetNode;

    if (key) {
      transaction.assignGraph(graph, key, targetNode);
    }

    transaction.assignGraph(graph, id, targetNode);
  }

  static direct(sourceKey, targetKey, targetNode) {
    const exec = serialize(targetNode, "graph");
    transaction.push(`Node.direct('${sourceKey}','${targetKey}',${exec})`);

    revive(targetNode);

    transaction.assignGraph(graph[sourceKey].next, targetKey, targetNode);
    transaction.assignGraph(targetNode.previous, sourceKey, graph[targetKey]);
  }
}

module.exports = Node;
