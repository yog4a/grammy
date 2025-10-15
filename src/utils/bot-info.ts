import { type WithPayload } from "src/core/types.js";
import { Bot, type Context } from 'grammy';

// Function
// ===========================================================

export async function fetchTelegramBotInfo(bot: Bot<WithPayload<Context>>, retries: number = 5): Promise<{ id: `${bigint}`, username: string }> {
    let bot_id = null;
    let bot_name = null;
    let retry_count = 0;
    do {
        try {
            const response = await bot.api.getMe();

            bot_id = String(response.id) as `${bigint}`;
            bot_name = response.username;

        } catch (error) {
            retry_count++;
            if (retry_count < retries) {
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                throw error;
            }
        }
    } while (!bot_id || !bot_name);

    return { id: bot_id, username: bot_name };
}