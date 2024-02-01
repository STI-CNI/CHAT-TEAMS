import { TurnContext } from "botbuilder";
import { SSOCommand } from "../helpers/botCommand";
export declare class ShowUserProfile extends SSOCommand {
    constructor();
    showUserInfo(context: TurnContext, ssoToken: string): Promise<void>;
}
