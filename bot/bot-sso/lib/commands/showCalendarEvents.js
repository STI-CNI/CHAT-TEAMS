"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowCalendarEvents = void 0;
const botbuilder_1 = require("botbuilder");
const teamsfx_1 = require("@microsoft/teamsfx");
const botCommand_1 = require("../helpers/botCommand");
const authConfig_1 = __importDefault(require("../authConfig"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/pt-br");
moment_timezone_1.default.locale('pt-br'); // define o locale global para pt-br
class ShowCalendarEvents extends botCommand_1.SSOCommand {
    constructor() {
        super();
        this.matchPatterns = [/^\s*agenda\s*/];
        this.operationWithSSOToken = this.showCalendarEvents;
    }
    async showCalendarEvents(context, ssoToken) {
        await context.sendActivity("Buscando eventos na agenda ...");
        // Call Microsoft Graph on behalf of user
        const oboCredential = new teamsfx_1.OnBehalfOfUserCredential(ssoToken, authConfig_1.default);
        const graphClient = (0, teamsfx_1.createMicrosoftGraphClientWithCredential)(oboCredential, [
            "Calendars.Read", "Mail.Read"
        ]);
        const events = await graphClient.api("/me/events").get();
        if (events && events.value) {
            for (const event of events.value) {
                const eventDetails = await graphClient.api(`/me/events/${event.id}`).get();
                const bodyContent = eventDetails.body.content;
                const startDate = (0, moment_timezone_1.default)(event.start.dateTime).tz('America/Sao_Paulo').format('LLLL');
                const endDate = (0, moment_timezone_1.default)(event.end.dateTime).tz('America/Sao_Paulo').format('LLLL');
                const card = botbuilder_1.CardFactory.heroCard(event.subject, `Início: ${startDate}\n`, null // aqui você pode passar um array de imagens, se quiser
                );
                await context.sendActivity({ attachments: [card] });
            }
        }
        else {
            await context.sendActivity("Não foi possível recuperar os eventos do calendário do Microsoft Graph.");
        }
    }
}
exports.ShowCalendarEvents = ShowCalendarEvents;
//# sourceMappingURL=showCalendarEvents.js.map