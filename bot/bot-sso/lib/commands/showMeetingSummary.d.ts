import { TurnContext } from "botbuilder";
import { SSOCommand } from "../helpers/botCommand";
export declare class ShowMeetingSummary extends SSOCommand {
    constructor();
    showMeetingInfo(context: TurnContext, ssoToken: string): Promise<void>;
}
