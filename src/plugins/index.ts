import type { Bot, Context } from 'grammy';
import type { WithPayload } from 'src/core/types.js';

// Middlewares
import { sequentializePlugin } from './middlewares/concurrency.js';
import { rateLimiterPlugin } from './middlewares/rate-limiter.js';
import { enrichContext } from './middlewares/enrich-context.js';
import { configureErrorHandling } from './middlewares/error-handling.js';

// Transformers
import { autoRetryPlugin } from './transformers/auto-retry.js';
import { floodLimit } from './transformers/flood-limit.js';

// Function
// ===========================================================

export function configurePlugins<C extends Context>(bot: Bot<C>): void {
    // Middlewares
    bot.use(sequentializePlugin);
    bot.use(rateLimiterPlugin);
    bot.use(enrichContext);
    
    // Transformers
    bot.api.config.use(autoRetryPlugin);
    //bot.api.config.use(floodLimit);

    // Error handling
    configureErrorHandling(bot);
}
