"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSOCommand = exports.BotCommand = void 0;
class BotCommand {
    validateParameters(parameters) {
        return true;
    }
    expressionMatchesText(userInput) {
        let matchResult;
        for (const pattern of this.matchPatterns) {
            if (typeof pattern == "string") {
                matchResult = new RegExp(pattern).exec(userInput);
            }
            else if (pattern instanceof RegExp) {
                matchResult = pattern.exec(userInput);
            }
            else {
                matchResult = pattern(userInput);
            }
            if (matchResult) {
                return matchResult;
            }
        }
        return false;
    }
}
exports.BotCommand = BotCommand;
class SSOCommand extends BotCommand {
    validateParameters(parameters) {
        if (!parameters.ssoDialog) {
            throw new Error(`SSOCommand failed: missing input "ssoDialog".`);
        }
        if (!parameters.context) {
            throw new Error(`SSOCommand failed: missing input "context".`);
        }
        if (!parameters.dialogState) {
            throw new Error(`SSOCommand failed: missing input "dialogState".`);
        }
        return true;
    }
    async run(parameters) {
        this.validateParameters(parameters);
        const ssoDialog = parameters.ssoDialog;
        ssoDialog.setSSOOperation(this.operationWithSSOToken);
        await ssoDialog.run(parameters.context, parameters.dialogState);
    }
}
exports.SSOCommand = SSOCommand;
//# sourceMappingURL=botCommand.js.map