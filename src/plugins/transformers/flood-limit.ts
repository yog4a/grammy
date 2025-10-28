import type { Transformer } from "grammy";

// Types
// ===========================================================

type ChatId = number | string;

interface FloodState {
  timestamps: number[];
  cooldownUntil: number | null;
}

const floodMap = new Map<ChatId, FloodState>();

const MAX_PER_MINUTE = 30;
const COOLDOWN_SECONDS = 90;

// Mid
// ===========================================================

export function floodLimit({ debug = false }: { debug?: boolean } = {}): Transformer {
    return async (prev, method, payload, signal) => {
        // Only intercept send* methods
        if (!method.startsWith("send")) {
            return prev(method, payload, signal);
        }

        // Only intercept payload with chat id
        const chat_id: ChatId | undefined = (payload as any)?.chat_id;
        if (!chat_id) {
            return prev(method, payload, signal);
        }

        const now = Date.now();
        const state = floodMap.get(chat_id) ?? { timestamps: [], cooldownUntil: null };

        // In cooldown → block
        if (state.cooldownUntil && now < state.cooldownUntil) {
            const remainingSeconds = Math.ceil((state.cooldownUntil - now) / 1000);
            if (debug) {
                console.warn(`[FloodLimit] Chat ${chat_id} still cooling down for ${remainingSeconds} seconds`);
            }
            return {
                ok: false,
                error_code: 429,
                description: `Chat ${chat_id} still cooling down for ${remainingSeconds} seconds`,
            };
        }

        // Drop timestamps older than 60s
        state.timestamps = state.timestamps.filter(t => now - t < 60_000);
        state.timestamps.push(now);

        // Too many in last minute?
        if (state.timestamps.length > MAX_PER_MINUTE) {
            state.cooldownUntil = now + COOLDOWN_SECONDS * 1000;
            floodMap.set(chat_id, state);
            if (debug) {
                console.warn(`[FloodLimit] Chat ${chat_id} exceeded ${MAX_PER_MINUTE}/min — cooldown ${COOLDOWN_SECONDS}s`);
            }

            // Try to send a warning message
            try {
                await prev("sendMessage", {
                    chat_id,
                    text: `⚠️ You're rate limited for ${COOLDOWN_SECONDS / 60} minutes — too many messages.`,
                }, signal);
            } catch {}

            return {
                ok: false,
                error_code: 429,
                description: `Chat ${chat_id} exceeded ${MAX_PER_MINUTE}/min — cooldown ${COOLDOWN_SECONDS}s`,
            };
        }

        floodMap.set(chat_id, state);
        return prev(method, payload, signal);
    };
}