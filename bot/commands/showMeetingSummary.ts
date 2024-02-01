import { ResponseType } from "@microsoft/microsoft-graph-client";
import { CardFactory, TurnContext } from "botbuilder";
import {
  createMicrosoftGraphClientWithCredential,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { SSOCommand } from "../helpers/botCommand";
import oboAuthConfig from "../authConfig";

export class ShowMeetingSummary extends SSOCommand {
  constructor() {
    super();
    this.matchPatterns = [/^\s*resumo\s*/];
    this.operationWithSSOToken = this.showMeetingInfo;
  }

  async showMeetingInfo(context: TurnContext, ssoToken: string) {
    await context.sendActivity("Retrieving meeting information from Microsoft Graph ...");

    // Call Microsoft Graph half of user
    const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
    const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
      "User.Read",
      "Calendars.Read",
      "Calendars.Read.Shared",
      "OnlineMeetings.Read.All",
      "Calls.Read.All",
      "Group.Read.All",
      "Directory.Read.All",
    ]);

    // Get the user's upcoming meetings
    const meetings = await graphClient.api("/me/calendar/events").get();

    // Find the first meeting with a transcription
    let meetingWithTranscription = null;
    for (const meeting of meetings.value) {
      if (meeting.onlineMeeting && meeting.onlineMeeting.meetingInfo && meeting.onlineMeeting.meetingInfo.meetingId) {
        const transcription = await graphClient.api(`/communications/calls/${meeting.onlineMeeting.meetingInfo.meetingId}/sessions/latest/segments/$/microsoft.graph.callTranscriptionSegment`).get();
        if (transcription && transcription.value && transcription.value.length > 0) {
          meetingWithTranscription = meeting;
          break;
        }
      }
    }

    if (meetingWithTranscription) {
      // Get the transcription for the meeting
      const transcription = await graphClient.api(`/communications/calls/${meetingWithTranscription.onlineMeeting.meetingInfo.meetingId}/sessions/latest/segments/$/microsoft.graph.callTranscriptionSegment`).get();

      // Extract the relevant information from the transcription
      let summary = "";
      for (const segment of transcription.value) {
        if (segment.isFinal) {
          for (const phrase of segment.phrases) {
            if (phrase.speakerId === "0") {
              summary += phrase.text + " ";
            }
          }
        }
      }

      // Send the meeting summary to the user
      await context.sendActivity(`Meeting summary for ${meetingWithTranscription.subject}: ${summary}`);

    } else {
      await context.sendActivity("Could not find a meeting with a transcription.");
    }
  }
}