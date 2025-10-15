import type { Context } from 'grammy';
import { run, sequentialize } from "@grammyjs/runner";

//  Auto Retry
// ===========================================================

export const sequentializePlugin = sequentialize((ctx: Context) => {
    const chat = ctx.chat?.id.toString();
    const user = ctx.from?.id.toString();
    return [chat, user].filter((con) => con !== undefined);
});
