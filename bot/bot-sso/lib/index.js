"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required packages
const restify = __importStar(require("restify"));
const path = __importStar(require("path"));
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const botbuilder_1 = require("botbuilder");
// This bot's main dialog.
const teamsBot_1 = require("./teamsBot");
const config_1 = __importDefault(require("./config"));
// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const credentialsFactory = new botbuilder_1.ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: config_1.default.botId,
    MicrosoftAppPassword: config_1.default.botPassword,
    MicrosoftAppType: "MultiTenant",
});
const botFrameworkAuthentication = new botbuilder_1.ConfigurationBotFrameworkAuthentication({}, credentialsFactory);
const adapter = new botbuilder_1.CloudAdapter(botFrameworkAuthentication);
// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity("OnTurnError Trace", `${error}`, "https://www.botframework.com/schemas/error", "TurnError");
    // Send a message to the user
    await context.sendActivity(`The bot encountered unhandled error:\n ${error.message}`);
    await context.sendActivity("To continue to run this bot, please fix the bot source code.");
};
// Set the onTurnError for the singleton CloudAdapter
adapter.onTurnError = onTurnErrorHandler;
// Create the bot that will handle incoming messages.
const bot = new teamsBot_1.TeamsBot();
// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});
// Listen for incoming requests.
server.post("/api/messages", async (req, res) => {
    await adapter
        .process(req, res, async (context) => {
        await bot.run(context);
    })
        .catch((err) => {
        // Error message including "412" means it is waiting for user's consent, which is a normal process of SSO, sholdn't throw this error.
        if (!err.message.includes("412")) {
            throw err;
        }
    });
});
server.get("/auth-:name(start|end).html", restify.plugins.serveStatic({
    directory: path.join(__dirname, "public"),
}));
//# sourceMappingURL=index.js.map