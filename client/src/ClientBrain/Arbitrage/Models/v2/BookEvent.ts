import BookBet from "./BookBet";
import { SportEnum } from "./enum/SportEnum";
import Participant from "./Participant";

export default class BookEvent {
    public BookBets: BookBet[];
    public LeagueName: string;
    public Sport: SportEnum;
    public EventParticipants: Participant[];
    public GameId: string;
    public SportsBookGameId: string;
    public SportsBookThirdPartyGameId: string;
    public EventDate: Date;

    constructor(LeagueName: string, Sport: string, GameId: string, EventDate: Date){
        this.BookBets = []
        this.LeagueName = LeagueName;
        //todo enum converter
        this.Sport = SportEnum.Baseball;
        this.EventParticipants = [];
        this.GameId = GameId;
        this.EventDate = EventDate;
        this.SportsBookGameId = '';
        this.SportsBookThirdPartyGameId = '';
    }
}