"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowUserProfile = void 0;
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const botbuilder_1 = require("botbuilder");
const teamsfx_1 = require("@microsoft/teamsfx");
const botCommand_1 = require("../helpers/botCommand");
const authConfig_1 = __importDefault(require("../authConfig"));
class ShowUserProfile extends botCommand_1.SSOCommand {
    constructor() {
        super();
        this.matchPatterns = [/^\s*show\s*/];
        this.operationWithSSOToken = this.showUserInfo;
    }
    async showUserInfo(context, ssoToken) {
        await context.sendActivity("Retrieving user information from Microsoft Graph ...");
        // Call Microsoft Graph half of user
        const oboCredential = new teamsfx_1.OnBehalfOfUserCredential(ssoToken, authConfig_1.default);
        const graphClient = (0, teamsfx_1.createMicrosoftGraphClientWithCredential)(oboCredential, [
            "User.Read",
        ]);
        const me = await graphClient.api("/me").get();
        if (me) {
            await context.sendActivity(`You're logged in as ${me.displayName} (${me.userPrincipalName})${me.jobTitle ? `; your job title is: ${me.jobTitle}` : ""}.`);
            // show user picture
            let photoBinary;
            try {
                photoBinary = await graphClient
                    .api("/me/photo/$value")
                    .responseType(microsoft_graph_client_1.ResponseType.ARRAYBUFFER)
                    .get();
            }
            catch (_a) {
                return;
            }
            const buffer = Buffer.from(photoBinary);
            const imageUri = "data:image/png;base64," + buffer.toString("base64");
            const card = botbuilder_1.CardFactory.thumbnailCard("User Picture", botbuilder_1.CardFactory.images([imageUri]));
            await context.sendActivity({ attachments: [card] });
        }
        else {
            await context.sendActivity("Could not retrieve profile information from Microsoft Graph.");
        }
    }
}
exports.ShowUserProfile = ShowUserProfile;
//# sourceMappingURL=showUserProfile.js.map