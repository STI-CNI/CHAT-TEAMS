"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeCommand = void 0;
const botCommand_1 = require("../helpers/botCommand");
const utils_1 = require("../helpers/utils");
const rawWelcomeCard = require("../adaptiveCards/welcome.json");
class WelcomeCommand extends botCommand_1.BotCommand {
    constructor() {
        super();
        this.matchPatterns = [/^\s*welcome\s*/];
    }
    async run(parameters) {
        const card = utils_1.Utils.renderAdaptiveCard(rawWelcomeCard);
        return await parameters.context.sendActivity({ attachments: [card] });
    }
}
exports.WelcomeCommand = WelcomeCommand;
//# sourceMappingURL=welcome.js.map