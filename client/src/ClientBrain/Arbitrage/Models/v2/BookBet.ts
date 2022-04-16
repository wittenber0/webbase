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
    public BetType: BetTypeEnum;
    public PlayerPropType: PlayerPropTypeEnum;
    public BetDuration: BetDuration;
    public Line: number;
    public betFactors: BetFactor[];
    public BetParticipants: Participant[];
    public JoinLabel: string;
    public Book: Book;

    public GenerateExampleModels(){
        let book = new Book(1001, 'BetOnline', 'BetOnlineLogo');
        let participant1 = new Participant(1, 'D\'Angelo Russell');
        let participant2 = new Participant(2, 'Tim Anderson');
        let participant3 = new Participant(3, 'Brandon Lowe');
        let bookBetOverUnderAssistsDangeloRussell = new BookBet()
        {
            //basketball
            this.GameId = '123',
            this.BetType = BetTypeEnum.PlayerProp,
            this.PlayerPropType = PlayerPropTypeEnum.Assists,
            this.BetDuration = BetDuration.Game,
            this.Line = 7.5
            this.Book = book;
        };
        bookBetOverUnderAssistsDangeloRussell.betFactors = [];
        bookBetOverUnderAssistsDangeloRussell.betFactors.push
        (
            new BetFactor(BetFactorTypeEnum.Over, new Factor(1.9, -114, book)),
            new BetFactor(BetFactorTypeEnum.Under, new Factor(1.9, -114, book))
        );
         
        bookBetOverUnderAssistsDangeloRussell.BetParticipants = [];
        bookBetOverUnderAssistsDangeloRussell.BetParticipants.push(participant1);
        //this should come from the game(the date)
        bookBetOverUnderAssistsDangeloRussell.JoinLabel = this.GenerateJoinLabel('20220416');
        
        
        let bookBetHeadToHeadTimWinsBrandon = new BookBet()
        {
            //baseball
            this.GameId = '234',
            this.BetType = BetTypeEnum.PlayerProp,
            this.BetDuration = BetDuration.Game,
            this.PlayerPropType = PlayerPropTypeEnum.MostTotalBases,
            this.Line = 0,
            this.Book = book
        };

        bookBetHeadToHeadTimWinsBrandon.betFactors = [];
        bookBetHeadToHeadTimWinsBrandon.betFactors.push(
            new BetFactor(BetFactorTypeEnum.HeadToHead, new Factor(1.95, -105, book))
        );
        bookBetHeadToHeadTimWinsBrandon.BetParticipants = [];
        bookBetHeadToHeadTimWinsBrandon.BetParticipants.push(participant2, participant3);
        bookBetHeadToHeadTimWinsBrandon.JoinLabel = this.GenerateJoinLabel('20220416');


        let bookBetHeadToHeadBrandonWinsTim = new BookBet()
        {
            //baseball
            this.GameId = '234',
            this.BetType = BetTypeEnum.PlayerProp,
            this.BetDuration = BetDuration.Game,
            this.PlayerPropType = PlayerPropTypeEnum.MostTotalBases,
            this.Line = 0,
            this.Book = book
        };
        bookBetHeadToHeadBrandonWinsTim.betFactors = [];
        bookBetHeadToHeadBrandonWinsTim.betFactors.push(
            new BetFactor(BetFactorTypeEnum.HeadToHead, new Factor(1.69, -145, book))
        );
        
        bookBetHeadToHeadBrandonWinsTim.BetParticipants = [];
        bookBetHeadToHeadBrandonWinsTim.BetParticipants.push(participant3, participant2);

        //PlayerProp|Game||Brandon|Tim|20220416
        bookBetHeadToHeadBrandonWinsTim.JoinLabel = this.GenerateJoinLabel('20220416');

    }

    public GenerateJoinLabel(gameDateString: string):string{
        let playerPropLabel = this.PlayerPropType != PlayerPropTypeEnum.NonApplicable ? `${this.PlayerPropType.toString()}|` : '';  
        let participantsLabel = Array.join(this.BetParticipants.map(p => p.Name), '|');
        let joinLabel = `${this.BetType.toString()}|${playerPropLabel}${this.BetDuration.toString()}|${participantsLabel}|${gameDateString}`;
         
        return joinLabel;
    }
}

