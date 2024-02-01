"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const learn_1 = require("./learn");
const showUserProfile_1 = require("./showUserProfile");
const welcome_1 = require("./welcome");
const showCalendarEvents_1 = require("./showCalendarEvents");
exports.commands = [
    new learn_1.LearnCommand(),
    new showUserProfile_1.ShowUserProfile(),
    new welcome_1.WelcomeCommand(),
    new showCalendarEvents_1.ShowCalendarEvents(),
];
//# sourceMappingURL=index.js.map