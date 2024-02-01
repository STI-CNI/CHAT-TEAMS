import { CardFactory, TurnContext } from "botbuilder";
import {
  createMicrosoftGraphClientWithCredential,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { SSOCommand } from "../helpers/botCommand";
import oboAuthConfig from "../authConfig";
import moment from "moment-timezone";
import 'moment/locale/pt-br';

moment.locale('pt-br'); // define o locale global para pt-br

export class ShowCalendarEvents extends SSOCommand {
  constructor() {
    super();
    this.matchPatterns = [/^\s*agenda\s*/];
    this.operationWithSSOToken = this.showCalendarEvents;
  }

  async showCalendarEvents(context: TurnContext, ssoToken: string) {
    await context.sendActivity("Buscando eventos na agenda ...");

    // Call Microsoft Graph on behalf of user
    const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
    const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
      "Calendars.Read", "Mail.Read"
    ]);
    const events = await graphClient.api("/me/events").get();
    if (events && events.value) {
      for (const event of events.value) {
        const eventDetails = await graphClient.api(`/me/events/${event.id}`).get();
        const bodyContent = eventDetails.body.content;

        const startDate = moment(event.start.dateTime).tz('America/Sao_Paulo').format('LLLL');
        const endDate = moment(event.end.dateTime).tz('America/Sao_Paulo').format('LLLL');

        const card = CardFactory.heroCard(
          event.subject,
          `Início: ${startDate}\n`,
          null // aqui você pode passar um array de imagens, se quiser
        );
        await context.sendActivity({ attachments: [card] });
      }
    } else {
      await context.sendActivity(
        "Não foi possível recuperar os eventos do calendário do Microsoft Graph."
      );
    }
  }
}
