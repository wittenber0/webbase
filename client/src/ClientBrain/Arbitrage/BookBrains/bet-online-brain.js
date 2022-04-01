import ArbitrageService from '../../../Shared/arbitrage-service';

export default class BetOnlineBrain{

  constructor(){
    this.gameOdds = [];
    this.loadSport('baseball');
  }

  loadSport(sport){
    ArbitrageService.getBetOnlineOdds(sport).then((r)=>{
      console.log(r);
    })
  }
}
