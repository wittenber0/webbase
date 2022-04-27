import BetFactor from "./BetFactor";
import { BetDuration } from "./enum/BetDuration";
import { BetTypeEnum } from "./enum/BetTypeEnum";
import { PlayerPropTypeEnum } from "./enum/PlayerPropTypeEnum";
import { SportEnum } from "./enum/SportEnum";
import Participant from "./Participant";

export default class BettingEvent{
    public LeagueName: string;
    public Sport: SportEnum;
    public EventParticipants: Participant[];
    public GameId: string;
    public EventDate: Date;

    constructor(LeagueName: string, Sport: SportEnum, EventParticipants: Participant[], GameId: string, EventDate: Date){
        this.LeagueName = LeagueName;
        this.Sport = Sport;
        this.EventParticipants = EventParticipants;
        this.GameId = GameId;
        this.EventDate = EventDate;
    }
}