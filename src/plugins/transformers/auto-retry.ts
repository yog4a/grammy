import { autoRetry } from "@grammyjs/auto-retry";

// Plugin
// ===========================================================

export const autoRetryPlugin = autoRetry({
    maxRetryAttempts: 1,                 // Will only retry once after failure
    maxDelaySeconds: 15,                 // Won't retry if Telegram suggests waiting > 15 seconds
    rethrowInternalServerErrors: true,   // No retry for Telegram 5xx errors (fail fast)
    rethrowHttpErrors: true,             // No retry for network errors like connection loss
});
