"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsBot = void 0;
const botbuilder_1 = require("botbuilder");
const utils_1 = require("./helpers/utils");
const ssoDialog_1 = require("./helpers/ssoDialog");
const commandHelper_1 = require("./helpers/commandHelper");
const azure_openai_1 = require("azure-openai");
const rawWelcomeCard = require("./adaptiveCards/welcome.json");
const rawLearnCard = require("./adaptiveCards/learn.json");
class TeamsBot extends botbuilder_1.TeamsActivityHandler {
    constructor() {
        super();
        // Record the likeCount
        this.likeCountObj = { likeCount: 0 };
        // Define the state store for your bot.
        const memoryStorage = new botbuilder_1.MemoryStorage();
        // Create conversation and user state with in-memory storage provider.
        this.conversationState = new botbuilder_1.ConversationState(memoryStorage);
        this.userState = new botbuilder_1.UserState(memoryStorage);
        this.dialog = new ssoDialog_1.SSODialog(new botbuilder_1.MemoryStorage());
        this.dialogState = this.conversationState.createProperty("DialogState");
        // Create conversationDataAccessor
        this.conversationDataAccessor = this.conversationState.createProperty("ConversationData");
        this.openAiApi = new azure_openai_1.OpenAIApi(new azure_openai_1.Configuration({
            apiKey: process.env.AOAI_APIKEY,
            azure: {
                apiKey: process.env.AOAI_APIKEY,
                endpoint: process.env.AOAI_ENDPOINT,
                deploymentName: process.env.AOAI_MODEL,
            }
        }));
        this.systemPrompt = process.env.CHATGPT_SYSTEMCONTENT;
        this.onMessage(async (context, next) => {
            console.log("Running with Message Activity.");
            // Get the state from the conversation state.
            let conversationData = await this.conversationDataAccessor.get(context, { history: [] });
            let txt = context.activity.text;
            const removedMentionText = botbuilder_1.TurnContext.removeRecipientMention(context.activity);
            if (removedMentionText) {
                txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
            }
            // Append user's message to the history.
            conversationData.history.push({ role: azure_openai_1.ChatCompletionRequestMessageRoleEnum.User, content: this.systemPrompt + txt });
            // Send typing activity
            await context.sendActivity({ type: 'typing' });
            try {
                // conversationData.history.push({ role: ChatCompletionRequestMessageRoleEnum.System, content: this.systemPrompt });
                console.log("createChatCompletion request: " + JSON.stringify(conversationData.history));
                const completion = await this.openAiApi.createChatCompletion({
                    model: process.env.AOAI_MODEL,
                    messages: conversationData.history,
                    temperature: parseFloat(process.env.CHATFPT_TEMPERATURE),
                    max_tokens: parseInt(process.env.CHATGPT_MAXTOKEN),
                    top_p: parseFloat(process.env.CHATGPT_TOPP),
                    stop: process.env.CHATGPT_STOPSEQ
                });
                console.log("createChatCompletion response: " + completion.data.choices[0].message.content);
                await context.sendActivity(completion.data.choices[0].message.content);
                // Append AI's message to the history.
                conversationData.history.push({ role: azure_openai_1.ChatCompletionRequestMessageRoleEnum.Assistant, content: completion.data.choices[0].message.content });
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                }
                else {
                    console.log(error.message);
                }
            }
            await commandHelper_1.CommandsHelper.triggerCommand(txt, {
                context: context,
                ssoDialog: this.dialog,
                dialogState: this.dialogState,
                likeCount: this.likeCountObj,
            });
            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id) {
                    const card = utils_1.Utils.renderAdaptiveCard(rawWelcomeCard);
                    await context.sendActivity({ attachments: [card] });
                    break;
                }
            }
            await next();
        });
    }
    // Invoked when an action is taken on an Adaptive Card. The Adaptive Card sends an event to the Bot and this
    // method handles that event.
    async onAdaptiveCardInvoke(context, invokeValue) {
        // The verb "userlike" is sent from the Adaptive Card defined in adaptiveCards/learn.json
        if (invokeValue.action.verb === "userlike") {
            this.likeCountObj.likeCount++;
            const card = utils_1.Utils.renderAdaptiveCard(rawLearnCard, this.likeCountObj);
            await context.updateActivity({
                type: "message",
                id: context.activity.replyToId,
                attachments: [card],
            });
            return { statusCode: 200, type: undefined, value: undefined };
        }
    }
    async run(context) {
        await super.run(context);
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
    async handleTeamsSigninVerifyState(context, query) {
        console.log("Running dialog with signin/verifystate from an Invoke Activity.");
        await this.dialog.run(context, this.dialogState);
    }
    async handleTeamsSigninTokenExchange(context, query) {
        await this.dialog.run(context, this.dialogState);
    }
    async onSignInInvoke(context) {
        await this.dialog.run(context, this.dialogState);
    }
}
exports.TeamsBot = TeamsBot;
//# sourceMappingURL=teamsBot.js.map