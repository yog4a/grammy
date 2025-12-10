var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  HiddenDataHelper
};
