import type { MessageEntity } from "grammy/types";

/** Supported Telegram parse modes */
type Mode = "HTML" | "Markdown" | "MarkdownV2";

/**
 * HiddenDataManager
 * -----------------------------------------------------------
 * Encode & decode key/value pairs as hidden URLs inside Telegram messages.
 * Works with HTML, Markdown, or MarkdownV2 parse modes.
 */

export class HiddenDataHelper {
   private static readonly BASE_URL: string = "http://t.me/19f711";
   private static readonly INVISIBLE_CHAR = "\u200C"; // Zero-width non-joiner

   /**
    * Encode an object into multiple hidden URLs (one per key/value).
    * Returns an array of ready-to-append hidden link fragments.
    *
    * Example usage:
    *   const parts = HiddenDataHelper.encode({ id: 123, name: "ETH" }, "MarkdownV2");
    *   const message = `Token info${parts.join("")}`;
    */
   static encode(data: Record<string, string | number>, mode: Mode = "HTML"): string[] {
      const parts: string[] = [];
      const urls = this.buildUrls(data);

      for (const url of urls) {
         switch (mode) {
            case "HTML":
               parts.push(`<a href="${url}">${this.INVISIBLE_CHAR}</a>`);
               break;
            case "Markdown":
               parts.push(`[${this.INVISIBLE_CHAR}](${url})`);
               break;
            default: // MarkdownV2
               const safeUrl = url.replace(/\)/g, "\\)"); // Telegram MarkdownV2 forbids unescaped ')'
               parts.push(`[${this.INVISIBLE_CHAR}](${safeUrl})`);
               break;
         }
      }

      return parts;
   }

   /**
    * Decode all matching hidden URLs from message entities and reconstruct the original object.
    */
   static decode(entities: MessageEntity[] | undefined): Record<string, string | number> | null {
      if (!entities || entities.length === 0) return null;

      const result: Record<string, string | number> = {};

      for (const entity of entities) {
         if (entity.type !== "text_link" || !entity.url || !entity.url.startsWith(`${this.BASE_URL}#`)) {
            continue;
         }

         // Remove base url and split parts
         const parts = entity.url.replace(`${this.BASE_URL}#`, "").split("#");
         
         if (parts.length !== 3) {
            continue;
         }

         const key = decodeURIComponent(parts[0]!);
         const type = decodeURIComponent(parts[1]!);
         const valueRaw = decodeURIComponent(parts[2]!);

         // Convert based on type
         let value: string | number = valueRaw;
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
   private static buildUrls(data: Record<string, string | number>): string[] {
      return Object.entries(data).map(([key, value]) => {
         const type = typeof value;
         const encodedKey = encodeURIComponent(key);
         const encodedType = encodeURIComponent(type);
         const encodedValue = encodeURIComponent(value.toString());

         return `${this.BASE_URL}#${encodedKey}#${encodedType}#${encodedValue}`;
      });
   }
}