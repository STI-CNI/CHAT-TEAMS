"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowMeetingSummary = void 0;
const teamsfx_1 = require("@microsoft/teamsfx");
const botCommand_1 = require("../helpers/botCommand");
const authConfig_1 = __importDefault(require("../authConfig"));
class ShowMeetingSummary extends botCommand_1.SSOCommand {
    constructor() {
        super();
        this.matchPatterns = [/^\s*resumo\s*/];
        this.operationWithSSOToken = this.showMeetingInfo;
    }
    async showMeetingInfo(context, ssoToken) {
        await context.sendActivity("Retrieving meeting information from Microsoft Graph ...");
        // Call Microsoft Graph half of user
        const oboCredential = new teamsfx_1.OnBehalfOfUserCredential(ssoToken, authConfig_1.default);
        const graphClient = (0, teamsfx_1.createMicrosoftGraphClientWithCredential)(oboCredential, [
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
        }
        else {
            await context.sendActivity("Could not find a meeting with a transcription.");
        }
    }
}
exports.ShowMeetingSummary = ShowMeetingSummary;
//# sourceMappingURL=showMeetingSummary.js.map