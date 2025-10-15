import { type WithPayload } from "src/core/types.js";
import { Bot, GrammyError, HttpError, type Context } from 'grammy';

// Function
// ===========================================================

export function configureErrorHandling(bot: Bot<WithPayload<Context>>): void {
    bot.catch((error) => {
        const ctx = error.ctx;
        const err = error.error;
        try {
            console.error(`[grammy] Error while handling update ${ctx.update.update_id}`, error);

            if (err instanceof GrammyError) {
                console.error(`[grammy] Error in request ${ctx.update.update_id}`, err);
            } else if (err instanceof HttpError) {
                console.error(`[grammy] Error in request ${ctx.update.update_id}`, err);
            } else {
                console.error(`[grammy] Unexpected error in request ${ctx.update.update_id}`, err);
            }
        } catch (error) {
            console.error(`[grammy] Unexpected error in request ${ctx.update.update_id}`, error);
        }
    });
}