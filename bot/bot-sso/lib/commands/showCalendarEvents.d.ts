import { TurnContext } from "botbuilder";
import { SSOCommand } from "../helpers/botCommand";
import 'moment/locale/pt-br';
export declare class ShowCalendarEvents extends SSOCommand {
    constructor();
    showCalendarEvents(context: TurnContext, ssoToken: string): Promise<void>;
}
