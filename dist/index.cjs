"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Grammy: () => Grammy,
  GrammyAutoRetry: () => GrammyAutoRetry,
  GrammyChatMembers: () => GrammyChatMembers,
  GrammyMenu: () => GrammyMenu,
  GrammyParseMode: () => GrammyParseMode,
  GrammyRatelimiter: () => GrammyRatelimiter,
  GrammyRunner: () => GrammyRunner,
  GrammyStatelessQuestion: () => GrammyStatelessQuestion,
  GrammyTransformerThrottler: () => GrammyTransformerThrottler
});
module.exports = __toCommonJS(index_exports);
var Grammy = __toESM(require("grammy"), 1);
var GrammyAutoRetry = __toESM(require("@grammyjs/auto-retry"), 1);
var GrammyChatMembers = __toESM(require("@grammyjs/chat-members"), 1);
var GrammyMenu = __toESM(require("@grammyjs/menu"), 1);
var GrammyParseMode = __toESM(require("@grammyjs/parse-mode"), 1);
var GrammyRatelimiter = __toESM(require("@grammyjs/ratelimiter"), 1);
var GrammyRunner = __toESM(require("@grammyjs/runner"), 1);
var GrammyStatelessQuestion = __toESM(require("@grammyjs/stateless-question"), 1);
var GrammyTransformerThrottler = __toESM(require("@grammyjs/transformer-throttler"), 1);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Grammy,
  GrammyAutoRetry,
  GrammyChatMembers,
  GrammyMenu,
  GrammyParseMode,
  GrammyRatelimiter,
  GrammyRunner,
  GrammyStatelessQuestion,
  GrammyTransformerThrottler
});
