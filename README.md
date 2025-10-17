# @yog4a/grammy

A personal encapsulation module for [Grammy](https://grammy.dev), providing enhanced functionality.

## License

This project is licensed under the **Creative Commons Attribution–NonCommercial 4.0 International License (CC BY-NC 4.0)**.  
You’re free to use and modify it for personal or open-source projects, **but commercial use is not allowed**.

## Installation

```bash
npm install github:yog4a/grammy
pnpm add github:yog4a/grammy
```

## Usage

This package is organized into three main entry points:

### 1. `@yog4a/grammy`

This is a direct wrapper around the core [Grammy](https://grammy.dev) library and its recommended plugins.

- Use when you want convenient access to official Grammy functionality and plugins.
- Useful for quickly setting up bots using the standard library and its plugin ecosystem.

**Example:**
```ts
import { Grammy, GrammyMenu } from '@yog4a/grammy';

const bot = new Grammy.Bot('<BOT_TOKEN>');

bot.command('hi', (ctx) => ctx.reply('Hello from Grammy!'));

const menu = new GrammyMenu.Menu('main-menu');
bot.use(menu);

bot.start();
```

### 2. `@yog4a/grammy/core`

This module provides your project's **custom encapsulated classes** and integrations for use with Grammy.

- Use this import when you want to leverage internal base classes, structures, or OOP wrappers built for your project.
- Everything in `core` is your opinionated structure for scaling bots or maintaining standards across bots.

**Example:**
```ts
import { GrammyBot } from '@yog4a/grammy/core';
import type { WithPayload, ContextPayload } from '@yog4a/grammy/core';

const bot = new GrammyBot('<BOT_TOKEN>');

// Example: custom payload middleware
bot.use((ctx, next) => {
  // ctx.payload is typed as ContextPayload if using payload middleware
  // do something custom
  return next();
});

bot.start();
```

### 3. `@yog4a/grammy/helpers`

This entry contains helpers and utilities, including components for managing hidden data, payload handling, or project-level glue code.

- Use when you need access to small functional utilities or specialized helpers not covered by the core or upstream Grammy API.
- Best for advanced, internal use (not intended for most bot developers).

**Example:**
```ts
import { HiddenDataHelper } from '@yog4a/grammy/helpers';

const payload = HiddenDataHelper.extract(ctx.message?.text);
if (payload) {
  // do something with hidden data
}
```

# End of Selection

**Summary of structure:**

- `@yog4a/grammy` — Grammy library and plugins.
- `@yog4a/grammy/core` — Your project's structured, OOP bot classes.
- `@yog4a/grammy/helpers` — Helper functions and hidden-data utilities.

**Documentation for each plugin or helper can be found via your source code or internal project guides. For Grammy plugins, refer to the official [Grammy documentation](https://grammy.dev/plugins/).**
