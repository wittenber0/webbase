import Factor from "./Factor";
import { BetDuration } from "./enum/BetDuration";
import BetFactor from "./BetFactor";
import { BetTypeEnum } from "./enum/BetTypeEnum";
import Participant from "./Participant";
import Book from "./Book";
import { BetFactorTypeEnum } from "./enum/BetFactorTypeEnum";
import { PlayerPropTypeEnum } from "./enum/PlayerPropTypeEnum";

export default class BookBet {
    public GameId: string;
    public SportsBookGameId: string;
    public SportsBookThirdPartyGameId: string;
    public BetType: BetTypeEnum;
    public PlayerPropType: PlayerPropTypeEnum;
    public BetDuration: BetDuration;
    public Line: number;
    public BetFactors: BetFactor[];
    public BetParticipants: Participant[];
    public JoinLabel: string;
    public Book: Book;
    public debug?:any;

    constructor(gameId:string, betType: BetTypeEnum, playerPropType: PlayerPropTypeEnum, betDuration: BetDuration, line: number, betFactors: BetFactor[], betParticipants: Participant[], date:Date, book:Book, debug?:any){
        this.GameId = gameId;
        this.BetType = betType
        this.PlayerPropType = playerPropType;
        this.BetDuration = betDuration;
        this.Line = line;
        this.BetFactors = betFactors;
        this.BetParticipants = betParticipants;
        this.JoinLabel = this.GenerateJoinLabel(this.getDateString(date));
        this.Book = book;
        this.debug = debug;
        this.SportsBookGameId = '';
        this.SportsBookThirdPartyGameId = '';
    }

    public GenerateExampleModels(){
        let book = new Book(1001, 'BetOnline', 'BetOnlineLogo');
        let participant1 = new Participant(1, 'D\'Angelo Russell');
        let participant2 = new Participant(2, 'Tim Anderson');
        let participant3 = new Participant(3, 'Brandon Lowe');
        let betFactors1 = [];
        let betFactors2 = [];
        let betFactors3 = [];
        betFactors1.push
        (
            new BetFactor(BetFactorTypeEnum.Over, new Factor(1.9, -114, book)),
            new BetFactor(BetFactorTypeEnum.Under, new Factor(1.9, -114, book))
        );
        betFactors2.push(
            new BetFactor(BetFactorTypeEnum.HeadToHead, new Factor(1.95, -105, book))
        );
        betFactors3.push(
            new BetFactor(BetFactorTypeEnum.HeadToHead, new Factor(1.69, -145, book))
        );
        
        let bookBetOverUnderAssistsDangeloRussell = new BookBet(
            '123', 
            BetTypeEnum.PlayerProp, 
            PlayerPropTypeEnum.Assists, 
            BetDuration.Game, 
            7.5, 
            betFactors1, 
            [participant1], 
            new Date(2022,4, 16), 
            book
        )
//[participant1], 
        let bookBetHeadToHeadTimWinsBrandon = new BookBet(
            '234', 
            BetTypeEnum.PlayerProp, 
            PlayerPropTypeEnum.MostTotalBases, 
            BetDuration.Game, 
            0, 
            betFactors2, 
            [participant2, participant3], 
            new Date(2022,4, 16), 
            book
        )
        //        [participant2, participant3], 
            let bookBetHeadToHeadBrandonWinsTim = new BookBet(
            '234', 
            BetTypeEnum.PlayerProp, 
            PlayerPropTypeEnum.MostTotalBases, 
            BetDuration.Game, 
            0, 
            betFactors3, 
            [participant3, participant2], 
            new Date(2022,4, 16), 
            book
        )
    }
//[participant3, participant2], 
    public GenerateJoinLabel(gameDateString: string):string{
        let participantsLabel = this.BetParticipants.map(p => p.Name).join('|');
        let joinLabel = `${BetTypeEnum[this.BetType]}|${PlayerPropTypeEnum[this.PlayerPropType]}|${BetDuration[this.BetDuration]}|${participantsLabel}|${this.Line}|${gameDateString}`;
         
        return joinLabel;
    }

    getDateString(d:Date){
        return d.getFullYear().toString()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2);
    }
}

