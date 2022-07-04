# Nucleoid [![NPM](https://img.shields.io/npm/l/nucleoidjs)](https://www.apache.org/licenses/LICENSE-2.0) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nucleoidjs/nucleoid/Test)](https://github.com/NucleoidJS/Nucleoid/actions/workflows/test.yml) [![npm](https://img.shields.io/npm/v/nucleoidjs)](https://www.npmjs.com/package/nucleoidjs) [![Discord](https://img.shields.io/badge/chat-Discord-brightgreen)](https://discord.gg/eWXFCCuU5y)

![Banner](.github/media/banner.png)

Nucleoid is a low-code framework for Node.js that lets you build your APIs with the help of AI and built-in datastore.

As writing just like any other codes in Node.js, it rerenders the very same JavaScript codes and makes the necessary adjustments in the state as well as stores on the disk, so that your application doesn't require external database or anything else.

## How it works

I. Write your business logic in JavaScript

```javascript
app.post("/users", () => {
  new User("Daphne");
});
```

II. Nucleoid renders your codes with AI

III. Creates APIs with built-in datastore

## Hello World

```javascript
const app = nucleoid();

class User {
  constructor(name) {
    this.name = name;
  }
}

// 👇 This is it!
app.post("/users", () => {
  new User("Daphne");
});

app.listen(3000);
```

It is pretty much it, you successfully persisted your first object with this :point_up_2: without external database

## Features

- Immediately start writing business logic
- Internal Data Management
- All you need is JavaScript
- Lighting fast

## Join [Thinkers Club](https://github.com/NucleoidJS/Nucleoid/discussions/categories/thinkers-club)

If you have an opinion, you are already a philosopher. We are working on new approach to data and logic. Come join us in discussions.

| Pinned Discussions                                    |
| ----------------------------------------------------- |
| https://github.com/NucleoidJS/Nucleoid/discussions/11 |

## Nucleoid IDE

Nucleoid IDE is a web interface that helps to run very same NPM package with OpenAPI.

[Go to Nucleoid IDE](https://nucleoid.com/ide/)

![Nucleoid IDE](https://cdn.nucleoid.com/media/prompt-2.gif)

## Fight against Spaghetti Code!

We are working on the new approach to data and logic that it organically lowers code lines and complexity.

![Cape](https://cdn.nucleoid.com/media/cape.png)

Learn more at [nucleoid.com](https://nucleoid.com)

## Project Status

Track at [Trello](https://trello.com/b/TZ73H1Fk/nucleoid)

- [x] [Beta](https://www.npmjs.com/package/nucleoidjs) is out
- [x] ES6 support
- [ ] ES2018 support
- [ ] ES2020 support
- [ ] TypeScript
- [ ] [IDE](https://github.com/NucleoidJS/IDE) (WiP)
- [ ] Production-ready

Please report an [issue](https://github.com/NucleoidJS/Nucleoid/issues) or ask a question at [Discussions](https://github.com/NucleoidJS/Nucleoid/discussions)
