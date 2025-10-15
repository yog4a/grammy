import type { Bot, Context } from 'grammy';

import { autoRetryPlugin } from './middlewares/auto-retry.js';
import { sequentializePlugin } from './middlewares/concurrency.js';
import { rateLimiterPlugin } from './middlewares/rate-limiter.js';
import { payload, type ContextPayload } from './middlewares/payload.js';
import { configureErrorHandling } from './middlewares/error-handling.js';

// Function
// ===========================================================

export function configurePlugins(bot: Bot<Context & { _payload: ContextPayload }>): void {
    // Middlewares
    bot.use(sequentializePlugin);
    bot.use(rateLimiterPlugin);
    bot.use(payload);
    
    // Transformers
    bot.api.config.use(autoRetryPlugin);

    // Error handling
    configureErrorHandling(bot);
}
