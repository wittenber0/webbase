import ActionNetworkBrain from './action-network-brain-v2';
import BetOnlineBrain from './BookBrains/bet-online-brain';
import PinnacleBrain from './BookBrains/pinnacle-brain';
import BetChoice from './Models/v2/BetChoice'
import BookEvent from './Models/v2/BookEvent';
import BettingEvent from './Models/v2/BettingEvent';
import BookBet from './Models/v2/BookBet';
import BetFactor from './Models/v2/BetFactor';
import BetChoiceFactors from './Models/v2/BetChoiceFactors';
import Factor from './Models/v2/Factor';
import FactorTypeSummary from './Models/v2/FactorTypeSummary';
import { RadioButtonUncheckedTwoTone } from '@material-ui/icons';
import { BetFactorTypeEnum } from './Models/v2/enum/BetFactorTypeEnum';

class BetChoiceManager {
  private static Instance?: BetChoiceManager;
  AllBets: BetChoice[];
  AllEvents: BettingEvent[];
  ActionNetworkBrain: ActionNetworkBrain;
  BetOnlineBrain: BetOnlineBrain;
  PinnacleBrain: PinnacleBrain;

  private constructor() {
    this.AllBets = [];
    this.AllEvents = [];
    this.ActionNetworkBrain = new ActionNetworkBrain();
    this.BetOnlineBrain = new BetOnlineBrain();
    this.PinnacleBrain = new PinnacleBrain();
  }

  private static createInstance() {
    var object = new BetChoiceManager();
    return object;
  }

  public static getInstance() {
    if (!this.Instance) {
      this.Instance = this.createInstance();
    }
    return this.Instance;
  }

  async loadActionNetworkGameTree() {

    return await this.ActionNetworkBrain.getGameTree().then(gameTree => {
      return gameTree;
    });
  }

  async loadBetOnlineGameTree() {

    return await this.BetOnlineBrain.getGameTree().then(gameTree => {
      return gameTree;
    });
  }

  async loadPinnacleGameTree() {

    return await this.PinnacleBrain.getGameTree().then(gameTree => {
      return gameTree;
    });
  }

  async loadBetChoices() {
    this.AllEvents = [];
    this.AllBets = [];
    let bookGameTrees = [
      //this.loadActionNetworkGameTree(),
      // this.loadBetOnlineGameTree(),
      this.loadPinnacleGameTree()
    ]
    return await Promise.all(bookGameTrees).then(trees => {
      console.log(trees);
      trees.forEach((tree: BookEvent[]) => {
        tree.forEach((bookEvent: BookEvent) => {
          if (bookEvent.BookBets) {
            bookEvent.BookBets.forEach((bookBet: BookBet) => {
              this.loadChoicesForBetChoice(bookBet, bookEvent);
              if (bookBet.Book.BookId === 1003) {
                this.loadPinnacleOddsForBetChoice(bookBet, bookEvent);
              }
            });
          }
        });
      });
      this.calculateBetChoices();
    });
  }

  loadChoicesForBetChoice(bookBet: BookBet, bookEvent: BookEvent) {
    let existingBetChoice = this.AllBets.find(b => b.BetChoiceId === bookBet.JoinLabel && b.BettingEvent.GameId === bookBet.GameId);
    if (existingBetChoice !== undefined) {
      bookBet.BetFactors.forEach(bf => {
        let bcf = existingBetChoice?.Choices.find(c => c.Label === BetFactorTypeEnum[bf.Label] || (c.Label === BetFactorTypeEnum[BetFactorTypeEnum.NumberRange] && c.Label === bf.LabelDetail));
        if (bcf !== undefined) {
          bcf.Factors.push(bf.Factor);
        } else {
          existingBetChoice?.Choices.push(new BetChoiceFactors(
            (bf.Label === BetFactorTypeEnum.NumberRange ? bf.LabelDetail : BetFactorTypeEnum[bf.Label]),
            [bf.Factor]
          ))
        }
      });
      existingBetChoice.debug.push(bookBet);
    } else {
      let newBetChoice = new BetChoice(
        bookEvent.BettingEvent, bookBet.JoinLabel, bookBet.BetParticipants, bookBet.BetType, bookBet.PlayerPropType, bookBet.BetDuration, bookBet.Line
      );
      bookBet.BetFactors.forEach(bf => {
        newBetChoice.Choices.push(new BetChoiceFactors(
          (bf.Label === BetFactorTypeEnum.NumberRange ? bf.LabelDetail : BetFactorTypeEnum[bf.Label]),
          [bf.Factor]
        ))
      })
      newBetChoice.debug.push(bookBet);
      this.AllBets.push(newBetChoice);
    }
  }

  loadPinnacleOddsForBetChoice(bookBet: BookBet, bookEvent: BookEvent) {
    let existingBetChoice = this.AllBets.find(b => b.BetChoiceId === bookBet.JoinLabel && b.BettingEvent.GameId === bookBet.GameId);
    if (existingBetChoice === undefined) {
      let newBetChoice = new BetChoice(
        bookEvent.BettingEvent, bookBet.JoinLabel, bookBet.BetParticipants, bookBet.BetType, bookBet.PlayerPropType, bookBet.BetDuration, bookBet.Line
      );
      newBetChoice.PinnacleOdds = bookBet.BetFactors;
      this.AllBets.push(newBetChoice);
    } else {
      existingBetChoice.PinnacleOdds = bookBet.BetFactors;
    }
  }

  calculateBetChoices() {
    this.AllBets.forEach(betChoice => {
      this.calculateBetChoiceInfo(betChoice);
    });
  }

  calculateBetChoiceInfo(betChoice: BetChoice) {
    betChoice.Choices.forEach((bcf: BetChoiceFactors) => {
      bcf.Factors.sort((a, b) => { return b.DecimalOdds - a.DecimalOdds });
      bcf.Factors[0].Best = true;
      if (betChoice.HouseLine) {
        betChoice.HouseLine += 1 / bcf.Factors[0].DecimalOdds;
      } else {
        betChoice.HouseLine = 1 / bcf.Factors[0].DecimalOdds;
      }

    })

    this.calculateRealOdds(betChoice);
    this.calculateEVs(betChoice);
  }

  calculateRealOdds(betChoice: BetChoice) {
    let pTotal = 0;

    if (betChoice.PinnacleOdds) {
      betChoice.PinnacleOdds.forEach(bf => {
        pTotal += 1 / bf.Factor.DecimalOdds;
      })

      if (pTotal) {
        if (pTotal < 0.5) {
          console.log(betChoice);
        }
        betChoice.PinnacleOdds.forEach(bf => {
          if (betChoice.RealOdds) {
            betChoice.RealOdds.push(new FactorTypeSummary((BetFactorTypeEnum.NumberRange === bf.Label && bf.LabelDetail ? bf.LabelDetail : BetFactorTypeEnum[bf.Label]), (1 / bf.Factor.DecimalOdds) / pTotal))
          } else {
            betChoice.RealOdds = [new FactorTypeSummary((BetFactorTypeEnum.NumberRange === bf.Label && bf.LabelDetail ? bf.LabelDetail : BetFactorTypeEnum[bf.Label]), (1 / bf.Factor.DecimalOdds) / pTotal)]
          }

        })
      }
    }

  }



  calculateEVs(betChoice: BetChoice) {
    if (betChoice.RealOdds) {
      betChoice.Choices.forEach(c => {
        let bestCEV: number;
        c.Factors.forEach(f => {
          let realP = betChoice.RealOdds?.find(o => o.PickLabel === c.Label)?.Value;
          if (realP) {
            f.EV = Math.round((f.DecimalOdds * realP - 1) * 100 / 2 * 100) / 100;
            if (betChoice.BestEV === undefined) {
              betChoice.BestEV = f.EV;
            } else if (f.EV > betChoice.BestEV) {
              betChoice.BestEV = f.EV;
            }
            if (bestCEV === undefined) {
              bestCEV = f.EV;
            } else if (f.EV > bestCEV) {
              bestCEV = f.EV;
            }
            let existingEV = betChoice.Evs?.find(fs => fs.PickLabel === c.Label)
            if (betChoice.Evs && existingEV === undefined) {
              betChoice.Evs.push(new FactorTypeSummary(c.Label, bestCEV));
            } else if (betChoice.Evs === undefined) {
              betChoice.Evs = [new FactorTypeSummary(c.Label, bestCEV)];
            }

          }

        })
      })
    }

  }



  getGameOddsSortedBy(sort: string) {
    if (sort === 'ev') {
      return this.AllBets.filter(g => g.BestEV).sort(this.mySort);
    }
    if (sort === 'arb') {
      return this.AllBets.sort(this.mySort2);
    }
  }

  mySort(a: BetChoice, b: BetChoice) {
    return (b.BestEV ? b.BestEV : -100) - (a.BestEV ? a.BestEV : -100)
  }

  mySort2(a: BetChoice, b: BetChoice) {
    return (a.HouseLine ? a.HouseLine : 100) - (b.HouseLine ? b.HouseLine : 100);
  }
}

export default BetChoiceManager;
