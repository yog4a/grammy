import type { WithPayload } from "./types.js";
import { Bot, Context } from 'grammy';
import { run, type RunOptions } from '@grammyjs/runner';

// Extensions
import { configurePlugins } from 'src/plugins/index.js';    
import { fetchTelegramBotInfo } from 'src/utils/bot-info.js';

//  Class
// ===========================================================

export class GrammyBot {
    private readonly _bot: Bot<WithPayload<Context>>;
    private _runner: ReturnType<typeof run> | null = null;
    private _info: { id: `${bigint}`, username: string } | null = null;

    // Constructor

    constructor(
        private readonly token: string,
        private readonly debug: boolean = false,
    ) {
        if (!token) {
            throw new Error("Telegram token is missing!");
        }

        this._bot = new Bot(token);
        configurePlugins(this._bot);
    }

    // Public

    public get bot(): Bot<WithPayload<Context>> {
        return this._bot;
    }

    public async start(options: RunOptions<any> = {}): Promise<{ bot_id: `${bigint}`, bot_username: string }> {
        if (this._runner?.isRunning()) {
            if (this.debug) {
                console.warn("[grammy] Bot is already running!");
            }
            return { bot_id: this._info!.id, bot_username: this._info!.username};
        }
        if (this.debug) {
            console.log("[grammy] Bot is starting...");
        }
        try {
            // Initialize runner
            this._runner = run(this.bot, options);
      
            // Fetch bot info once
            this._info = await fetchTelegramBotInfo(this.bot);
            const { id, username } = this._info;
      
            console.log(`[grammy] ${username} (ID: ${id}) has started`);
            return { bot_id: id, bot_username: username};
        } 
        catch (error) {
            console.error("[grammy] Failed to start bot:", (error as Error).message);
            throw error;
        }
    }

    public async stop(): Promise<void> {
        if (this._runner && this._runner.isRunning()) {
            if (this.debug) {
                console.log('[grammy] Bot is stopping...');
            }
            await this._runner.stop();
            this._runner = null;
            if (this.debug) {
                console.log('[grammy] Bot has stopped');
            }
        } else {
            if (this.debug) {
                console.warn("[grammy] Bot is not running!");
            }
        }
    }
}
