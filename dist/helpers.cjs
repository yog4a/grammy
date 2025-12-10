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

// src/helpers.ts
var helpers_exports = {};
__export(helpers_exports, {
  HiddenDataHelper: () => HiddenDataHelper
});
module.exports = __toCommonJS(helpers_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HiddenDataHelper
});
