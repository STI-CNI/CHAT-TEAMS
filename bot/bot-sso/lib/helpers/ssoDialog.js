"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSODialog = void 0;
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_1 = require("botbuilder");
const teamsfx_1 = require("@microsoft/teamsfx");
require("isomorphic-fetch");
const authConfig_1 = __importDefault(require("../authConfig"));
const config_1 = __importDefault(require("../config"));
const DIALOG_NAME = "SSODialog";
const MAIN_WATERFALL_DIALOG = "MainWaterfallDialog";
const TEAMS_SSO_PROMPT_ID = "TeamsFxSsoPrompt";
class SSODialog extends botbuilder_dialogs_1.ComponentDialog {
    // Developer controlls the lifecycle of credential provider, as well as the cache in it.
    // In this sample the provider is shared in all conversations
    constructor(dedupStorage) {
        super(DIALOG_NAME);
        this.requiredScopes = ["User.Read"]; // hard code the scopes for demo purpose only
        const initialLoginEndpoint = `https://${config_1.default.botDomain}/auth-start.html`;
        const dialog = new teamsfx_1.TeamsBotSsoPrompt(authConfig_1.default, initialLoginEndpoint, TEAMS_SSO_PROMPT_ID, {
            scopes: this.requiredScopes,
            endOnInvalidMessage: true,
        });
        this.addDialog(dialog);
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.ssoStep.bind(this),
            this.dedupStep.bind(this),
            this.executeOperationWithSSO.bind(this),
        ]));
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        this.dedupStorage = dedupStorage;
        this.dedupStorageKeys = [];
    }
    setSSOOperation(handler) {
        this.operationWithSSO = handler;
    }
    resetSSOOperation() {
        this.operationWithSSO = undefined;
    }
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} dialogContext
     */
    async run(context, dialogState) {
        const dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(context);
        let dialogTurnResult = await dialogContext.continueDialog();
        if (dialogTurnResult && dialogTurnResult.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
            dialogTurnResult = await dialogContext.beginDialog(this.id);
        }
    }
    async ssoStep(stepContext) {
        return await stepContext.beginDialog(TEAMS_SSO_PROMPT_ID);
    }
    async dedupStep(stepContext) {
        const tokenResponse = stepContext.result;
        // Only dedup after ssoStep to make sure that all Teams client would receive the login request
        if (tokenResponse && (await this.shouldDedup(stepContext.context))) {
            return botbuilder_dialogs_1.Dialog.EndOfTurn;
        }
        return await stepContext.next(tokenResponse);
    }
    async executeOperationWithSSO(stepContext) {
        const tokenResponse = stepContext.result;
        if (!tokenResponse || !tokenResponse.ssoToken) {
            await stepContext.context.sendActivity("There is an issue while trying to sign you in and retrieve your profile photo, please type \"show\" command to login and consent permissions again.");
        }
        else {
            // Once got ssoToken, run operation that depends on ssoToken
            if (this.operationWithSSO) {
                await this.operationWithSSO(stepContext.context, tokenResponse.ssoToken);
            }
        }
        return await stepContext.endDialog();
    }
    async onEndDialog(context) {
        const conversationId = context.activity.conversation.id;
        const currentDedupKeys = this.dedupStorageKeys.filter((key) => key.indexOf(conversationId) > 0);
        await this.dedupStorage.delete(currentDedupKeys);
        this.dedupStorageKeys = this.dedupStorageKeys.filter((key) => key.indexOf(conversationId) < 0);
        this.resetSSOOperation();
    }
    // If a user is signed into multiple Teams clients, the Bot might receive a "signin/tokenExchange" from each client.
    // Each token exchange request for a specific user login will have an identical activity.value.Id.
    // Only one of these token exchange requests should be processed by the bot.  For a distributed bot in production,
    // this requires a distributed storage to ensure only one token exchange is processed.
    async shouldDedup(context) {
        const storeItem = {
            eTag: context.activity.value.id,
        };
        const key = this.getStorageKey(context);
        const storeItems = { [key]: storeItem };
        try {
            await this.dedupStorage.write(storeItems);
            this.dedupStorageKeys.push(key);
        }
        catch (err) {
            if (err instanceof Error && err.message.indexOf("eTag conflict")) {
                return true;
            }
            throw err;
        }
        return false;
    }
    getStorageKey(context) {
        if (!context || !context.activity || !context.activity.conversation) {
            throw new Error("Invalid context, can not get storage key!");
        }
        const activity = context.activity;
        const channelId = activity.channelId;
        const conversationId = activity.conversation.id;
        if (activity.type !== botbuilder_1.ActivityTypes.Invoke ||
            activity.name !== botbuilder_1.tokenExchangeOperationName) {
            throw new Error("TokenExchangeState can only be used with Invokes of signin/tokenExchange.");
        }
        const value = activity.value;
        if (!value || !value.id) {
            throw new Error("Invalid signin/tokenExchange. Missing activity.value.id.");
        }
        return `${channelId}/${conversationId}/${value.id}`;
    }
}
exports.SSODialog = SSODialog;
//# sourceMappingURL=ssoDialog.js.map