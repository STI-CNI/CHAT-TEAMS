import { TeamsActivityHandler, TurnContext, SigninStateVerificationQuery, BotState, AdaptiveCardInvokeValue, AdaptiveCardInvokeResponse, StatePropertyAccessor } from "botbuilder";
import { SSODialog } from "./helpers/ssoDialog";
import { CommandsHelper } from "./helpers/commandHelper";
import { OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "azure-openai";
export interface ConversationData {
    history: {
        role: ChatCompletionRequestMessageRoleEnum;
        content: string;
    }[];
}
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
    conversationDataAccessor: StatePropertyAccessor<ConversationData>;
    systemPrompt: string;
    userPrompt: string;
    constructor();
    onAdaptiveCardInvoke(context: TurnContext, invokeValue: AdaptiveCardInvokeValue): Promise<AdaptiveCardInvokeResponse>;
    run(context: TurnContext): Promise<void>;
    handleTeamsSigninVerifyState(context: TurnContext, query: SigninStateVerificationQuery): Promise<void>;
    handleTeamsSigninTokenExchange(context: TurnContext, query: SigninStateVerificationQuery): Promise<void>;
    onSignInInvoke(context: TurnContext): Promise<void>;
}
