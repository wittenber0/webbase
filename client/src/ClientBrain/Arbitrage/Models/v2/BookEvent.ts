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
}