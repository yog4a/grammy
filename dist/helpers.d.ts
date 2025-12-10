import { MessageEntity } from 'grammy/types';

/** Supported Telegram parse modes */
type Mode = "HTML" | "Markdown" | "MarkdownV2";
/**
 * HiddenDataManager
 * -----------------------------------------------------------
 * Encode & decode key/value pairs as hidden URLs inside Telegram messages.
 * Works with HTML, Markdown, or MarkdownV2 parse modes.
 */
declare class HiddenDataHelper {
    private static readonly BASE_URL;
    private static readonly INVISIBLE_CHAR;
    /**
     * Encode an object into multiple hidden URLs (one per key/value).
     * Returns an array of ready-to-append hidden link fragments.
     *
     * Example usage:
     *   const parts = HiddenDataHelper.encode({ id: 123, name: "ETH" }, "MarkdownV2");
     *   const message = `Token info${parts.join("")}`;
     */
    static encode(data: Record<string, string | number>, mode?: Mode): string[];
    /**
     * Decode all matching hidden URLs from message entities and reconstruct the original object.
     */
    static decode(entities: MessageEntity[] | undefined): Record<string, string | number> | null;
    /**
     * Build URLs for each key-value pair
     * Each key-value pair becomes: BASE_URL#key#type#value
     */
    private static buildUrls;
}

export { HiddenDataHelper };
