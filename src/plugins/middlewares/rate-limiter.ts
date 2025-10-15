import type { Context } from 'grammy';
import { limit as rateLimiter } from '@grammyjs/ratelimiter';

// Plugin
// ===========================================================

export const rateLimiterPlugin = rateLimiter({
    timeFrame: 2000,  // 2 seconds
    limit: 3,         // 3 requests

    // This is called when the limit is exceeded
    onLimitExceeded: (ctx: Context) => {
        const userName = ctx.from?.username 
            ? `@${ctx.from.username}` 
            : ctx.from?.first_name || 'there';

        ctx.reply(`Hey ${userName}, you're sending requests too quickly! Please slow down.`)
            .catch(() => {});
    },

    // Note that the key should be a number in string format such as "123456789"
    keyGenerator: (ctx: Context) => {
        // Only rate-limit actual bot interactions
        const isCommand = ctx.message?.text?.startsWith('/');
        const isReplyToBot = ctx.message?.reply_to_message?.from?.id === ctx.me.id;
        const isMention = ctx.message?.text?.includes(`@${ctx.me.username}`);
        const isCallbackQuery = !!ctx.callbackQuery; // Inline button clicks
        const isInlineQuery = !!ctx.inlineQuery; // Inline mode usage
        
        // If it's an interaction, apply rate limiting
        if (isCommand || isReplyToBot || isMention || isCallbackQuery || isInlineQuery) {
            return ctx.from?.id?.toString();
        }
        return undefined;
    },
});
