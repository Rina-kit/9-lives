export interface ITeam {
    id: number,
    name: string,
    players: {
        id: number,
        name: string,
        surname: string,
        nickname: string,
        country: number,
        teamId: number,
        team: string
    }[],
    teamTournamentResults: string[],
    teamRatings: {
        id: number,
        score: number,
        atMoment: string,
        teamId: number,
        team: string
    }[],
    matchesWon: {
        id: number,
        winnerId: number,
        loserId: number,
        tournamentId: number,
        date: string,
        winner: string,
        loser: string,
        tournament: string
    }[],
    matchesLost: {
        id: number,
        winnerId: number,
        loserId: number,
        tournamentId: number,
        date: string,
        winner: string,
        loser: string,
        tournament: string
    }[]
}