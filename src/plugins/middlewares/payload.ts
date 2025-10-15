import type { Context, NextFunction } from 'grammy';
import type { MenuFlavor } from "@grammyjs/menu";
import { HiddenDataHelper } from 'src/helpers/HiddenDataHelper.js';

//  Types
// ===========================================================

export type ContextPayload = {
    timestamp: number,
    bot_id: `${bigint}`,
    bot_username: string,
    user_id: `${bigint}`;
    user_name: string;
    chat_id: `${bigint}`;
    chat_name: string;
    msg_id: `${bigint}`;
    msg_text: string;
    reply_msg_id: `${bigint}` | undefined;
    reply_msg_text: string | undefined;
    hidden_data: Record<string, string | number> | undefined;
    hidden_reply_data: Record<string, string | number> | undefined;
}

//  Function
// ===========================================================

export const payload = async (ctx: Context | (Context & MenuFlavor), next: NextFunction): Promise<void> => {
    try {
        if (!ctx) {
            throw new Error("Context is undefined");
        }
        if (ctx.chat?.type === 'channel') {
            throw new Error("Interaction from channels is not authorized");
        }

        const data: Partial<ContextPayload> = {
            timestamp: Date.now(),
        };

        if (ctx.me) {
            data.bot_id = ctx.me.id.toString() as `${bigint}`;
            data.bot_username = ctx.me.username;

            if (!data.bot_id || !data.bot_username) {
                throw new Error("Missing bot.id or bot.username in 'me' field");
            }
        }

        if (ctx.from) {
            data.user_id = ctx.from.id.toString() as `${bigint}`;
            data.user_name = ctx.from.username || ctx.from.first_name;

            if (!data.user_id || !data.user_name) {
                throw new Error("Missing user.id or user.name in 'from' field");
            }
        }

        if (ctx.chat) {
            data.chat_id = ctx.chat.id.toString() as `${bigint}`;
            data.chat_name = ctx.chat.title || ctx.chat.type;

            if (!data.chat_id || !data.chat_name) {
                throw new Error("Missing chat.id or chat.name in 'chat' field");
            }
        }

        if (ctx.msg || ctx.message) {
            data.msg_id = (ctx.msg?.message_id || ctx.message?.message_id)?.toString() as `${bigint}`;
            data.msg_text = ctx.msg?.text || ctx.message?.text || '';

            if (!data.msg_id || !data.msg_text) {
                throw new Error("Missing msg.id or msg.text");
            }
        }

        // Add quote message data
        if (ctx.msg?.reply_to_message || ctx.message?.reply_to_message) {
            const id = ctx.msg?.reply_to_message?.message_id || ctx.message?.reply_to_message?.message_id;
            const text = ctx.msg?.reply_to_message?.text || ctx.message?.reply_to_message?.text;

            data.reply_msg_id = id?.toString() as `${bigint}` | undefined;
            data.reply_msg_text = text as string | undefined;
        }

        // Extract hidden data in message
        if (ctx.msg?.entities || ctx.message?.entities) {
            const entities = (ctx.msg?.entities || ctx.message?.entities);
            const hiddenData = HiddenDataHelper.decode(entities);

            if (hiddenData) {
                data.hidden_data = hiddenData;
            }
        }

        // Extract hidden reply data if available
        if (ctx.msg?.reply_to_message?.entities || ctx.message?.reply_to_message?.entities) {
            const entities = (ctx.msg?.reply_to_message?.entities || ctx.message?.reply_to_message?.entities);
            const hiddenData = HiddenDataHelper.decode(entities);

            if (hiddenData) {
                data.hidden_reply_data = hiddenData;
            }
        }

        // Attach the payload to the context if all data is valid
        (ctx as Context & { _payload: ContextPayload })['_payload'] = data as ContextPayload;

        // Proceed to the next middleware or handler
        await next();       

    } catch (error) {
        // On error, delete _payload and continue
        delete (ctx as { _payload?: ContextPayload })['_payload'];
        await next();
    }
}
