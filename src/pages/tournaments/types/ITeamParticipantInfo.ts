import {IMatchesLost} from "./IMatchesLost";
import {IMatchesWon} from "./IMatchesWon";
import {IPlayer} from "./IPlayer";
import {ITeamRating} from "./ITeamRating";

export interface ITeamParticipantInfo {
    id: number,
    standing: number,
    place: number,
    teamId: number,
    tournamentId: number,
    team: {
        id: number,
        name: string,
        players: IPlayer[],
        teamTournamentResults: string[],
        teamRatings: ITeamRating[],
        matchesWon: IMatchesWon[],
        matchesLost: IMatchesLost[]
    },
    tournament: string
}