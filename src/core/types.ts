import type { ContextPayload } from 'src/plugins/middlewares/payload.js';

//  Types
// ===========================================================

export type WithPayload<T> = T & { _payload: ContextPayload; }
