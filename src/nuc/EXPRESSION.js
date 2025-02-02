const state = require("../state");
const graph = require("../graph");
const Local = require("../lib/local");
const Id = require("../lib/identifier");
const Token = require("../lib/token");
const Node = require("./Node");
const LET = require("./LET");

let Stack;
let $CALL;

setImmediate(() => {
  Stack = require("../stack");
  $CALL = require("../lang/$nuc/$CALL");
});

class EXPRESSION {
  constructor(tokens) {
    this.instanceof = this.constructor.name;
    this.tokens = tokens;
  }

  before(scope, self) {
    this.tokens = this.tokens
      .map((token) => (token === self ? token + ".value" : token))
      .map((token) => {
        let parts = Id.splitLast(token);
        if (parts[0] && parts[1] && parts[0] === "value") {
          if (Local.check(scope, parts[1])) {
            return parts[1];
          }

          try {
            let value = state.run(scope, "state." + parts[1]);

            if (value === undefined)
              throw ReferenceError(`${parts[1]} is not defined`);

            return JSON.stringify(value);
          } catch (error) {
            throw ReferenceError(`${parts[1]} is not defined`);
          }
        } else return token;
      });
  }

  run(scope, skip = false, construct = true) {
    try {
      for (let i = 0; i < this.tokens.length; i++) {
        const token = this.tokens[i];

        if (token instanceof Token.CALL && graph[token.string]) {
          const value = Stack.process(
            [$CALL(token.string, token.params)],
            scope
          );

          // TODO Replace manual adjustment
          const call = "__$CALL__";
          scope.local[call] = value;
          scope.graph[call] = new LET(call);

          this.tokens[i] = new Token(call);
        }
      }

      let tokens = this.tokens
        .map((token) => (token = Local.reference(scope, token)))
        .map((token) => {
          let parts = token.split(/\.|\[|\]/);

          try {
            if (Local.check(scope, parts[0])) {
              return Local.retrieve(scope, token);
            } else if (graph[parts[0]]) {
              let reference = "state." + Id.reference(token);

              const match = reference.match(/\[(.*?)\]/);

              if (match) {
                const bracket = match[1];
                let parts = bracket.split(/\.|\[|\]/);

                if (Local.check(scope, parts[0])) {
                  const local = Local.retrieve(scope, bracket);
                  reference = reference.replace(/\[(.*?)\]/, `[${local}]`);
                }
              }

              let value = state.run(scope, reference);

              if (value === undefined && !skip) throw 0;
              return reference;
            } else {
              return token;
            }
          } catch (error) {
            if (error instanceof TypeError) throw 1;
            else if (error === 0) throw 1;
            else throw error;
          }
        });

      return construct ? tokens.construct() : tokens;
    } catch (error) {
      if (error instanceof Error) throw error;

      if (construct) {
        return "undefined";
      } else {
        const arr = new Token.ARRAY();
        arr.push(new Token("undefined"));
        return arr;
      }
    }
  }

  next() {
    let list = [];

    for (let token of this.tokens) {
      if (token instanceof Token.CALL) {
        let parts = Id.splitLast(token.string);
        if (parts[1] && graph[parts[1]]) {
          for (let node in graph[parts[1]].next)
            list.push(graph[parts[1]].next[node]);
        }
      }
    }

    return list;
  }

  graph(scope) {
    return this.tokens
      .list()
      .map((token) => Local.reference(scope, token))
      .map((token) => Id.reference(token))
      .filter((token) => {
        if (graph[token]) return true;
        else if (graph[token.split(".")[0]]) {
          graph[token] = new Node();
          return true;
        }
      })
      .map((token) => {
        let parts = Id.splitLast(token);
        if (parts[0] && parts[1] && parts[0] === "length") return parts[1];
        else return token;
      })
      .map((token) => {
        let fn;

        try {
          fn = state.run(scope, "state." + token);
        } catch (error) {
          return token;
        }

        if (typeof fn === "function") {
          let parts = Id.splitLast(token);
          return parts[1];
        } else {
          return token;
        }
      });
  }
}

module.exports = EXPRESSION;
