"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnCommand = void 0;
const botCommand_1 = require("../helpers/botCommand");
const utils_1 = require("../helpers/utils");
const rawLearnCard = require("../adaptiveCards/learn.json");
class LearnCommand extends botCommand_1.BotCommand {
    constructor() {
        super();
        this.matchPatterns = [/^\s*learn\s*/];
    }
    validateParameters(parameters) {
        if (!parameters.likeCount) {
            throw new Error(`Command "learn" failed: missing input "likeCount"`);
        }
        return true;
    }
    async run(parameters) {
        this.validateParameters(parameters);
        const card = utils_1.Utils.renderAdaptiveCard(rawLearnCard, parameters.likeCount);
        return await parameters.context.sendActivity({ attachments: [card] });
    }
}
exports.LearnCommand = LearnCommand;
//# sourceMappingURL=learn.js.map