import { TeamsActivityHandler, TurnContext, SigninStateVerificationQuery, BotState, AdaptiveCardInvokeValue, AdaptiveCardInvokeResponse } from "botbuilder";
import { SSODialog } from "./helpers/ssoDialog";
import { CommandsHelper } from "./helpers/commandHelper";
import { OpenAIApi } from "azure-openai";
export declare class TeamsBot extends TeamsActivityHandler {
    likeCountObj: {
        likeCount: number;
    };
    conversationState: BotState;
    userState: BotState;
    dialog: SSODialog;
    dialogState: any;
    commandsHelper: CommandsHelper;
    openAiApi: OpenAIApi;
    constructor();
    onAdaptiveCardInvoke(context: TurnContext, invokeValue: AdaptiveCardInvokeValue): Promise<AdaptiveCardInvokeResponse>;
    run(context: TurnContext): Promise<void>;
    handleTeamsSigninVerifyState(context: TurnContext, query: SigninStateVerificationQuery): Promise<void>;
    handleTeamsSigninTokenExchange(context: TurnContext, query: SigninStateVerificationQuery): Promise<void>;
    onSignInInvoke(context: TurnContext): Promise<void>;
}
