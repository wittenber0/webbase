import BettingEvent from "./BettingEvent";
import BookBet from "./BookBet";
import { SportEnum } from "./enum/SportEnum";
import Participant from "./Participant";

export default class BookEvent {
    public BookBets: BookBet[];
    public BettingEvent: BettingEvent;


    constructor(BookBets: BookBet[], bettingEvent: BettingEvent){
        this.BookBets = BookBets;
        this.BettingEvent = bettingEvent;
    }
    
}