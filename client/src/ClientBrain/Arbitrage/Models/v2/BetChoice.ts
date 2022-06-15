import BetChoiceFactors from "./BetChoiceFactors";
import BetFactor from "./BetFactor";
import BettingEvent from "./BettingEvent";
import BookBet from "./BookBet";
import BookEvent from "./BookEvent";
import { BetFactorTypeEnum } from "./enum/BetFactorTypeEnum";
import { SportEnum } from "./enum/SportEnum";
import Participant from "./Participant";
import FactorTypeSummary from "./FactorTypeSummary";
import { BetTypeEnum } from "./enum/BetTypeEnum";
import { PlayerPropTypeEnum } from "./enum/PlayerPropTypeEnum";
import { BetDuration } from "./enum/BetDuration";

export default class BetChoice{
    BettingEvent: BettingEvent;
    BetChoiceId:string;
    BetParticipants: Participant[];
    BetType: BetTypeEnum;
    PlayerPropType: PlayerPropTypeEnum;
    BetDuration: BetDuration;
    Line: number;

    Choices: BetChoiceFactors[];
    PinnacleOdds?: BetFactor[];
    BetOnlineOdds?: BetFactor[];
    RealOdds?: FactorTypeSummary[];
    Evs?: FactorTypeSummary[];
    HouseLine?: number;
    BestEV?: number;
    debug:BookBet[];

    constructor(bettingEvent: BettingEvent, betChoiceId:string, betParticipants: Participant[], betType: BetTypeEnum, playerPropType: PlayerPropTypeEnum, betDuration: BetDuration, line: number){
        this.BettingEvent = bettingEvent;
        this.BetChoiceId = betChoiceId;
        this.BetParticipants = betParticipants;
        this.BetType = betType;
        this.PlayerPropType = playerPropType;
        this.BetDuration = betDuration;
        this.Line = line;
        
        this.Choices = [];
        this.debug = [];
    }
}