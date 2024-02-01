"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsHelper = void 0;
const commands_1 = require("../commands");
class CommandsHelper {
    static async triggerCommand(userInput, parameters) {
        for (let command of commands_1.commands) {
            if (command.expressionMatchesText(userInput)) {
                await command.run(parameters);
                break;
            }
        }
    }
}
exports.CommandsHelper = CommandsHelper;
//# sourceMappingURL=commandHelper.js.map