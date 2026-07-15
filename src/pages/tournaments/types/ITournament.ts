import {ITeamParticipantInfo} from "./ITeamParticipantInfo";
import {ITournamentPrize} from "./ITournamentPrize";

export interface ITournament {
    id: number,
    name: string,
    organizer: string,
    startDate: string,
    endDate: string,
    teamParticipantInfos: ITeamParticipantInfo[],
    tournamentPrizes: ITournamentPrize[]
}