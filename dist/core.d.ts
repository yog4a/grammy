import { Bot, Context } from 'grammy';
import { RunOptions } from '@grammyjs/runner';

type ContextPayload = {
    timestamp: number;
    bot_id: `${bigint}`;
    bot_username: string;
    user_id: `${bigint}`;
    user_name: string;
    chat_id: `${bigint}`;
    chat_name: string;
    msg_id: `${bigint}`;
    msg_text: string;
    reply_msg_id: `${bigint}` | undefined;
    reply_msg_text: string | undefined;
    hidden_data: Record<string, string | number> | undefined;
    hidden_reply_data: Record<string, string | number> | undefined;
};

type WithPayload<T> = T & {
    _payload: ContextPayload;
};

declare class GrammyBot {
    private readonly token;
    private readonly debug;
    private readonly _bot;
    private _runner;
    private _info;
    constructor(token: string, debug?: boolean);
    get bot(): Bot<WithPayload<Context>>;
    start(options?: RunOptions<any>): Promise<{
        bot_id: `${bigint}`;
        bot_username: string;
    }>;
    stop(): Promise<void>;
}

export { type ContextPayload, GrammyBot, type WithPayload };
