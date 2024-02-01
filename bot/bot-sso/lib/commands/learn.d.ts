import { BotCommand } from "../helpers/botCommand";
export declare class LearnCommand extends BotCommand {
    constructor();
    validateParameters(parameters: any): boolean;
    run(parameters: any): Promise<any>;
}
