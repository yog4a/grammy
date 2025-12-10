"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core.ts
var core_exports = {};
__export(core_exports, {
  GrammyBot: () => GrammyBot
});
module.exports = __toCommonJS(core_exports);

// src/core/bot.ts
var import_grammy2 = require("grammy");
var import_runner2 = require("@grammyjs/runner");

// src/plugins/middlewares/concurrency.ts
var import_runner = require("@grammyjs/runner");
var sequentializePlugin = (0, import_runner.sequentialize)((ctx) => {
  const chat = ctx.chat?.id.toString();
  const user = ctx.from?.id.toString();
  return [chat, user].filter((con) => con !== void 0);
});

// src/plugins/middlewares/rate-limiter.ts
var import_ratelimiter = require("@grammyjs/ratelimiter");
var rateLimiterPlugin = (0, import_ratelimiter.limit)({
  timeFrame: 2e3,
  // 2 seconds
  limit: 3,
  // 3 requests
  // This is called when the limit is exceeded
  onLimitExceeded: /* @__PURE__ */ __name((ctx) => {
    const userName = ctx.from?.username ? `@${ctx.from.username}` : ctx.from?.first_name || "there";
    ctx.reply(`Hey ${userName}, you're sending requests too quickly! Please slow down.`).catch(() => {
    });
  }, "onLimitExceeded"),
  // Note that the key should be a number in string format such as "123456789"
  keyGenerator: /* @__PURE__ */ __name((ctx) => {
    const isCommand = ctx.message?.text?.startsWith("/");
    const isReplyToBot = ctx.message?.reply_to_message?.from?.id === ctx.me.id;
    const isMention = ctx.message?.text?.includes(`@${ctx.me.username}`);
    const isCallbackQuery = !!ctx.callbackQuery;
    const isInlineQuery = !!ctx.inlineQuery;
    if (isCommand || isReplyToBot || isMention || isCallbackQuery || isInlineQuery) {
      return ctx.from?.id?.toString();
    }
    return void 0;
  }, "keyGenerator")
});

// src/helpers/HiddenDataHelper.ts
var HiddenDataHelper = class {
  static {
    __name(this, "HiddenDataHelper");
  }
  static BASE_URL = "http://t.me/19f711";
  static INVISIBLE_CHAR = "\u200C";
  // Zero-width non-joiner
  /**
   * Encode an object into multiple hidden URLs (one per key/value).
   * Returns an array of ready-to-append hidden link fragments.
   *
   * Example usage:
   *   const parts = HiddenDataHelper.encode({ id: 123, name: "ETH" }, "MarkdownV2");
   *   const message = `Token info${parts.join("")}`;
   */
  static encode(data, mode = "HTML") {
    const parts = [];
    const urls = this.buildUrls(data);
    for (const url of urls) {
      switch (mode) {
        case "HTML":
          parts.push(`<a href="${url}">${this.INVISIBLE_CHAR}</a>`);
          break;
        case "Markdown":
          parts.push(`[${this.INVISIBLE_CHAR}](${url})`);
          break;
        default:
          const safeUrl = url.replace(/\)/g, "\\)");
          parts.push(`[${this.INVISIBLE_CHAR}](${safeUrl})`);
          break;
      }
    }
    return parts;
  }
  /**
   * Decode all matching hidden URLs from message entities and reconstruct the original object.
   */
  static decode(entities) {
    if (!entities || entities.length === 0) return null;
    const result = {};
    for (const entity of entities) {
      if (entity.type !== "text_link" || !entity.url || !entity.url.startsWith(`${this.BASE_URL}#`)) {
        continue;
      }
      const parts = entity.url.replace(`${this.BASE_URL}#`, "").split("#");
      if (parts.length !== 3) {
        continue;
      }
      const key = decodeURIComponent(parts[0]);
      const type = decodeURIComponent(parts[1]);
      const valueRaw = decodeURIComponent(parts[2]);
      let value = valueRaw;
      if (type === "number" && !Number.isNaN(Number(valueRaw))) {
        value = Number(valueRaw);
      }
      result[key] = value;
    }
    return Object.keys(result).length > 0 ? result : null;
  }
  /**
   * Build URLs for each key-value pair
   * Each key-value pair becomes: BASE_URL#key#type#value
   */
  static buildUrls(data) {
    return Object.entries(data).map(([key, value]) => {
      const type = typeof value;
      const encodedKey = encodeURIComponent(key);
      const encodedType = encodeURIComponent(type);
      const encodedValue = encodeURIComponent(value.toString());
      return `${this.BASE_URL}#${encodedKey}#${encodedType}#${encodedValue}`;
    });
  }
};

// src/plugins/middlewares/enrich-context.ts
var enrichContext = /* @__PURE__ */ __name(async (ctx, next) => {
  if (!ctx) {
    throw new Error("Context is undefined");
  }
  if (ctx.chat?.type === "channel") {
    throw new Error("Interaction from channels is not authorized");
  }
  const data = {
    timestamp: Date.now()
  };
  if (ctx.me) {
    data.bot_id = ctx.me.id.toString();
    data.bot_username = ctx.me.username;
    if (!data.bot_id || !data.bot_username) {
      throw new Error("Missing bot.id or bot.username in 'me' field");
    }
  }
  if (ctx.from) {
    data.user_id = ctx.from.id.toString();
    data.user_name = ctx.from.username || ctx.from.first_name;
    if (!data.user_id || !data.user_name) {
      throw new Error("Missing user.id or user.name in 'from' field");
    }
  }
  if (ctx.chat) {
    data.chat_id = ctx.chat.id.toString();
    data.chat_name = ctx.chat.title || ctx.chat.type;
    if (!data.chat_id || !data.chat_name) {
      throw new Error("Missing chat.id or chat.name in 'chat' field");
    }
  }
  if (ctx.msg || ctx.message) {
    data.msg_id = (ctx.msg?.message_id || ctx.message?.message_id)?.toString();
    data.msg_text = ctx.msg?.text || ctx.message?.text || "";
    if (!data.msg_id || !data.msg_text) {
      throw new Error("Missing msg.id or msg.text");
    }
  }
  if (ctx.msg?.reply_to_message || ctx.message?.reply_to_message) {
    const id = ctx.msg?.reply_to_message?.message_id || ctx.message?.reply_to_message?.message_id;
    const text = ctx.msg?.reply_to_message?.text || ctx.message?.reply_to_message?.text;
    data.reply_msg_id = id?.toString();
    data.reply_msg_text = text;
  }
  if (ctx.msg?.entities || ctx.message?.entities) {
    const entities = ctx.msg?.entities || ctx.message?.entities;
    const hiddenData = HiddenDataHelper.decode(entities);
    if (hiddenData) {
      data.hidden_data = hiddenData;
    }
  }
  if (ctx.msg?.reply_to_message?.entities || ctx.message?.reply_to_message?.entities) {
    const entities = ctx.msg?.reply_to_message?.entities || ctx.message?.reply_to_message?.entities;
    const hiddenData = HiddenDataHelper.decode(entities);
    if (hiddenData) {
      data.hidden_reply_data = hiddenData;
    }
  }
  ctx["_payload"] = data;
  await next();
}, "enrichContext");

// src/plugins/middlewares/error-handling.ts
var import_grammy = require("grammy");
function configureErrorHandling(bot) {
  bot.catch((error) => {
    const ctx = error.ctx;
    const err = error.error;
    try {
      console.error(`[grammy] Error while handling update ${ctx.update.update_id}`, error);
      if (err instanceof import_grammy.GrammyError) {
        console.error(`[grammy] Error in request ${ctx.update.update_id}`, err);
      } else if (err instanceof import_grammy.HttpError) {
        console.error(`[grammy] Error in request ${ctx.update.update_id}`, err);
      } else {
        console.error(`[grammy] Unexpected error in request ${ctx.update.update_id}`, err);
      }
    } catch (error2) {
      console.error(`[grammy] Unexpected error in request ${ctx.update.update_id}`, error2);
    }
  });
}
__name(configureErrorHandling, "configureErrorHandling");

// src/plugins/transformers/auto-retry.ts
var import_auto_retry = require("@grammyjs/auto-retry");
var autoRetryPlugin = (0, import_auto_retry.autoRetry)({
  maxRetryAttempts: 1,
  // Will only retry once after failure
  maxDelaySeconds: 15,
  // Won't retry if Telegram suggests waiting > 15 seconds
  rethrowInternalServerErrors: true,
  // No retry for Telegram 5xx errors (fail fast)
  rethrowHttpErrors: true
  // No retry for network errors like connection loss
});

// src/plugins/index.ts
function configurePlugins(bot) {
  bot.use(sequentializePlugin);
  bot.use(rateLimiterPlugin);
  bot.use(enrichContext);
  bot.api.config.use(autoRetryPlugin);
  configureErrorHandling(bot);
}
__name(configurePlugins, "configurePlugins");

// src/utils/bot-info.ts
async function fetchTelegramBotInfo(bot, retries = 5) {
  let bot_id = null;
  let bot_name = null;
  let retry_count = 0;
  do {
    try {
      const response = await bot.api.getMe();
      bot_id = String(response.id);
      bot_name = response.username;
    } catch (error) {
      retry_count++;
      if (retry_count < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        throw error;
      }
    }
  } while (!bot_id || !bot_name);
  return { id: bot_id, username: bot_name };
}
__name(fetchTelegramBotInfo, "fetchTelegramBotInfo");

// src/core/bot.ts
var GrammyBot = class {
  // Constructor
  constructor(token, debug = false) {
    this.token = token;
    this.debug = debug;
    if (!token) {
      throw new Error("Telegram token is missing!");
    }
    this._bot = new import_grammy2.Bot(token);
    configurePlugins(this._bot);
  }
  static {
    __name(this, "GrammyBot");
  }
  _bot;
  _runner = null;
  _info = null;
  // Public
  get bot() {
    return this._bot;
  }
  async start(options = {}) {
    if (this._runner?.isRunning()) {
      if (this.debug) {
        console.warn("[grammy] Bot is already running!");
      }
      return { bot_id: this._info.id, bot_username: this._info.username };
    }
    if (this.debug) {
      console.log("[grammy] Bot is starting...");
    }
    try {
      this._runner = (0, import_runner2.run)(this.bot, options);
      this._info = await fetchTelegramBotInfo(this.bot);
      const { id, username } = this._info;
      console.log(`[grammy] ${username} (ID: ${id}) has started`);
      return { bot_id: id, bot_username: username };
    } catch (error) {
      console.error("[grammy] Failed to start bot:", error.message);
      throw error;
    }
  }
  async stop() {
    if (this._runner && this._runner.isRunning()) {
      if (this.debug) {
        console.log("[grammy] Bot is stopping...");
      }
      await this._runner.stop();
      this._runner = null;
      if (this.debug) {
        console.log("[grammy] Bot has stopped");
      }
    } else {
      if (this.debug) {
        console.warn("[grammy] Bot is not running!");
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GrammyBot
});
