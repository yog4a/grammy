import type { ContextPayload } from 'src/plugins/middlewares/enrich-context.js';

//  Types
// ===========================================================

export type WithPayload<T> = T & { _payload: ContextPayload; }
