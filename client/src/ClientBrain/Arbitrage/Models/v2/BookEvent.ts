import BookBet from "./BookBet";
import { SportEnum } from "./enum/SportEnum";
import Participant from "./Participant";

export default class BookEvent {
    public BookBets: BookBet[];
    public LeagueName: string;
    public Sport: SportEnum;
    public EventParticipants: Participant[];
    public GameId: string;
    public EventDate: Date;

    constructor(BookBets: BookBet[], LeagueName: string, Sport: SportEnum, EventParticipants: Participant[], GameId: string, EventDate: Date){
        this.BookBets = BookBets;
        this.LeagueName = LeagueName;
        this.Sport = Sport;
        this.EventParticipants = EventParticipants;
        this.GameId = GameId;
        this.EventDate = EventDate;
    }
}